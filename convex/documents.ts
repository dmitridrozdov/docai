import {
    MutationCtx,
    QueryCtx,
    action,
    internalAction,
    internalMutation,
    internalQuery,
    mutation,
    query,
  } from "./_generated/server";
  import { ConvexError, v } from "convex/values";
  import { api, internal } from "./_generated/api";
  import { Id } from "./_generated/dataModel";

  import OpenAI from "openai";

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  export const getDocuments = query({
    async handler(ctx) {
      const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

      if (!userId) {
        return undefined;
      }

      return await ctx.db
        .query("documents")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .collect();
    },
  });

  export async function hasAccessToDocument(
    ctx: MutationCtx | QueryCtx,
    documentId: Id<"documents">
  ) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  
    if (!userId) {
      return null;
    }
  
    const document = await ctx.db.get(documentId);
  
    if (!document) {
      return null;
    }
    
    if (document?.tokenIdentifier !== userId) {
      return null;
    }

    return {document, userId};
  }

  export const hasAccessToDocumentQuery = internalQuery({
    args: {
      documentId: v.id("documents"),
    },
    async handler(ctx, args) {
      return await hasAccessToDocument(ctx, args.documentId);
    },
  });

  export const getDocument = query({
    args: {
      documentId: v.id("documents"),
    },
    async handler(ctx, args) {
      const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

      if (!userId) {
        return undefined;
      }

      const document = await ctx.db.get(args.documentId)

      if (!document) {
        return null;
      }

      if (document?.tokenIdentifier !== userId) {
        return null;
      }

      return { ...document, documentUrl: await ctx.storage.getUrl(document.fileId) };
    },
  });

  export const createDocument = mutation({
    args: {
      title: v.string(),
      fileId: v.id("_storage"),
    },
    async handler(ctx, args) {

      const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

      if (!userId) {
        throw new ConvexError("Unauthorized");
      }

      await ctx.db.insert("documents", {
        title: args.title,
        tokenIdentifier: userId,
        fileId: args.fileId,
      })
    }
  });

  export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  });

  export const askQuestion = action({
    args: {
      question: v.string(),
      documentId: v.id("documents"),
    },
    async handler(ctx, args) {
      const accessObject = await ctx.runQuery(internal.documents.hasAccessToDocumentQuery, {
        documentId: args.documentId,
      })

      if (!accessObject) {
        throw new ConvexError("You don't have access to this document");
      }

      const file = await ctx.storage.get(accessObject.document.fileId);

      if (!file) {
        throw new ConvexError("File not found");
      }

      const text = await file.text();

      const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
        await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `Here is a text file: ${text}`,
            },
            {
              role: "user",
              content: `please answer this question: ${args.question}`,
            },
          ],
          model: "gpt-3.5-turbo",
        });

        await ctx.runMutation(internal.chats.createChatRecord, {
          documentId: args.documentId,
          text: args.question,
          isHuman: true,
          tokenIdentifier: accessObject.userId,
        });

        const response =
          chatCompletion.choices[0].message.content ??
          "could not generate a response";
  
        await ctx.runMutation(internal.chats.createChatRecord, {
          documentId: args.documentId,
          text: response,
          isHuman: false,
          tokenIdentifier: accessObject.userId,
        });
      
      return response
    }
  });