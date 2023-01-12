import { Context, PostArgs, PostPayloadType } from '@/types'
import { canUserMutatePost } from '../../utils/canUserMutatePost'

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated access)',
          },
        ],
        post: null,
      }
    }
    const { title, content } = post
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: 'You must provide a title and a content.',
          },
        ],
        post: null,
      }
    }
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    })

    return {
      userErrors: [],
      post: newPost,
    }
  },

  postUpdate: async (
    _: any,
    { post, postId }: { postId: string; post: PostArgs['post'] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated access)',
          },
        ],
        post: null,
      }
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    })

    if (error) return error

    const { title, content } = post

    if (!title && !content) {
      return {
        userErrors: [
          {
            message: 'Need to have atleast one field to update',
          },
        ],
        post: null,
      }
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        id: +postId,
      },
    })

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post does not exist',
          },
        ],
        post: null,
      }
    }

    let payloadToUpdate = {
      title,
      content,
    }

    if (!title) delete payloadToUpdate.title
    if (!content) delete payloadToUpdate.content

    return {
      userErrors: [],
      post: await prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: +postId,
        },
      }),
    }
  },

  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated access)',
          },
        ],
        post: null,
      }
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    })

    if (error) return error

    if (!postId) {
      return {
        userErrors: [
          {
            message: 'Please provide a post ID',
          },
        ],
        post: null,
      }
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        id: +postId,
      },
    })

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: 'Post does not exist',
          },
        ],
        post: null,
      }
    }

    return {
      userErrors: [],
      post: await prisma.post.delete({
        where: {
          id: +postId,
        },
      }),
    }
  },

  postPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated access)',
          },
        ],
        post: null,
      }
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    })

    if (error) return error

    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: +postId,
        },
        data: {
          published: true,
        },
      }),
    }
  },

  postUnpublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: 'Forbidden access (unauthenticated access)',
          },
        ],
        post: null,
      }
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: +postId,
      prisma,
    })

    if (error) return error

    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: +postId,
        },
        data: {
          published: false,
        },
      }),
    }
  },
}
