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

  
  export const createDocument = mutation({
    args: {
      title: v.string()
    },
    async handler(ctx, args) {
      await ctx.db.insert("documents", {
        title: args.title,
      })
    }
  });


  // export const generateDocumentDescription = internalAction({
  //   args: {
  //     fileId: v.id("_storage"),
  //     documentId: v.id("documents"),
  //   },
  //   async handler(ctx, args) {
  //     const file = await ctx.storage.get(args.fileId);
  
  //     if (!file) {
  //       throw new ConvexError("File not found");
  //     }
  
  //     const text = await file.text();
  
  //     const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
  //       await openai.chat.completions.create({
  //         messages: [
  //           {
  //             role: "system",
  //             content: `Here is a text file: ${text}`,
  //           },
  //           {
  //             role: "user",
  //             content: `please generate 1 sentence description for this document.`,
  //           },
  //         ],
  //         model: "gpt-3.5-turbo",
  //       });
  
  //     const description =
  //       chatCompletion.choices[0].message.content ??
  //       "could not figure out the description for this document";
  
  //     const embedding = await embed(description);
  
  //     await ctx.runMutation(internal.documents.updateDocumentDescription, {
  //       documentId: args.documentId,
  //       description: description,
  //       embedding,
  //     });
  //   },
  // });
  
  // export const updateDocumentDescription = internalMutation({
  //   args: {
  //     documentId: v.id("documents"),
  //     description: v.string(),
  //     embedding: v.array(v.float64()),
  //   },
  //   async handler(ctx, args) {
  //     await ctx.db.patch(args.documentId, {
  //       description: args.description,
  //       embedding: args.embedding,
  //     });
  //   },
  // });
  
  // export const askQuestion = action({
  //   args: {
  //     question: v.string(),
  //     documentId: v.id("documents"),
  //   },
  //   async handler(ctx, args) {
  //     const accessObj = await ctx.runQuery(
  //       internal.documents.hasAccessToDocumentQuery,
  //       {
  //         documentId: args.documentId,
  //       }
  //     );
  
  //     if (!accessObj) {
  //       throw new ConvexError("You do not have access to this document");
  //     }
  
  //     const file = await ctx.storage.get(accessObj.document.fileId);
  
  //     if (!file) {
  //       throw new ConvexError("File not found");
  //     }
  
  //     const text = await file.text();
  
  //     const chatCompletion: OpenAI.Chat.Completions.ChatCompletion =
  //       await openai.chat.completions.create({
  //         messages: [
  //           {
  //             role: "system",
  //             content: `Here is a text file: ${text}`,
  //           },
  //           {
  //             role: "user",
  //             content: `please answer this question: ${args.question}`,
  //           },
  //         ],
  //         model: "gpt-3.5-turbo",
  //       });
  
  //     await ctx.runMutation(internal.chats.createChatRecord, {
  //       documentId: args.documentId,
  //       text: args.question,
  //       isHuman: true,
  //       tokenIdentifier: accessObj.userId,
  //     });
  
  //     const response =
  //       chatCompletion.choices[0].message.content ??
  //       "could not generate a response";
  
  //     await ctx.runMutation(internal.chats.createChatRecord, {
  //       documentId: args.documentId,
  //       text: response,
  //       isHuman: false,
  //       tokenIdentifier: accessObj.userId,
  //     });
  
  //     return response;
  //   },
  // });
  
  // export const deleteDocument = mutation({
  //   args: {
  //     documentId: v.id("documents"),
  //   },
  //   async handler(ctx, args) {
  //     const accessObj = await hasAccessToDocument(ctx, args.documentId);
  
  //     if (!accessObj) {
  //       throw new ConvexError("You do not have access to this document");
  //     }
  
  //     await ctx.storage.delete(accessObj.document.fileId);
  //     await ctx.db.delete(args.documentId);
  //   },
  // });