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