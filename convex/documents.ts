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

  // export const getDocument = query({
  //   args: {
  //     documentId: v.id("documents"),
  //   },
  //   async handler(ctx, args) {
  //     const accessObj = await hasAccessToDocument(ctx, args.documentId);
  
  //     if (!accessObj) {
  //       return null;
  //     }
      
  //     return {
  //       ...accessObj.document,
  //       documentUrl: await ctx.storage.getUrl(accessObj.document.fileId),
  //     };
  //   },
  // });

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
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {  
      throw new ConvexError("Unauthorized");
    }

    const document = await ctx.runQuery(api.documents.getDocument, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new ConvexError("Document not found");
    }

    const file = await ctx.storage.get(document.fileId);

    if (!file) {
      throw new ConvexError("File not found");
    }

    const chatComplete = await openai.chat.completions.create({
      messages: [{role: "user", content: "say this is the test"}],
      model: "gpt-3.5-turbo",
    })
    console.log(chatComplete.choices[0].message.content)
    return chatComplete.choices[0].message.content
  }
});