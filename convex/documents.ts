import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { Doc, Id } from './_generated/dataModel';

export const archive = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    // Fetch the target document
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error('Not found');
    if (existingDocument.userId !== userId) throw new Error('Unauthorized');

    // Recursive function to archive all child documents
    const recursiveArchiveChildren = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true });
        await recursiveArchiveChildren(child._id); // Recurse through children
      }
    };

    // Recursive function to archive all parent documents
    const recursiveArchiveParents = async (documentId: Id<'documents'>) => {
      const document = await ctx.db.get(documentId);
      if (document?.parentDocument) {
        const parent = await ctx.db.get(document.parentDocument);

        if (parent && !parent.isArchived) {
          await ctx.db.patch(parent._id, { isArchived: true });
          await recursiveArchiveParents(parent._id); // Recurse up to parents
        }
      }
    };

    // Archive the target document
    await ctx.db.patch(args.id, { isArchived: true });

    // Archive parents and children recursively
    await recursiveArchiveParents(args.id);
    await recursiveArchiveChildren(args.id);

    // Return the updated document
    return await ctx.db.get(args.id);
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q.eq('userId', userId).eq('parentDocument', args.parentDocument)
      )
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return documents;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error('Not authenticated');
    }

    const userId = identity.subject;

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), true))
      .order('desc')
      .collect();

    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    // Fetch the document
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) throw new Error('Not found');
    if (existingDocument.userId !== userId) throw new Error('Unauthorized');

    // Recursive function to restore child documents
    const recursiveRestoreChildren = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q.eq('userId', userId).eq('parentDocument', documentId)
        )
        .collect();

      for (const child of children) {
        if (child.isArchived) {
          await ctx.db.patch(child._id, { isArchived: false });
          await recursiveRestoreChildren(child._id); // Recurse through children
        }
      }
    };

    // Recursive function to restore parent documents
    const recursiveRestoreParents = async (documentId: Id<'documents'>) => {
      const document = await ctx.db.get(documentId);
      if (document?.parentDocument) {
        const parent = await ctx.db.get(document.parentDocument);

        if (parent?.isArchived) {
          await ctx.db.patch(parent._id, { isArchived: false });
          await recursiveRestoreParents(parent._id); // Recurse up to parents
        }
      }
    };

    // Prepare restore options
    const options: Partial<Doc<'documents'>> = { isArchived: false };

    // If the parent document exists and is archived, reset parentDocument
    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);

      if (parent?.isArchived) {
        options.parentDocument = undefined; // Remove parent reference
      }
    }

    // Restore the current document
    await ctx.db.patch(args.id, options);

    // Restore parents and children recursively
    await recursiveRestoreParents(args.id);
    await recursiveRestoreChildren(args.id);

    // Return the updated document
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) throw new Error('Not found');
    if (existingDocument.userId != userId) throw new Error('Unauthorized');

    const document = await ctx.db.delete(args.id);

    return document;
  },
});
