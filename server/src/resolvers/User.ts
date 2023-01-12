import { Context, UserParentType } from '@/types'

export const User = {
  posts: async (
    parent: UserParentType,
    __: any,
    { prisma, userInfo }: Context
  ) => {
    const isOwnProfile = parent.id === userInfo?.userId

    if (isOwnProfile) {
      return await prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      })
    } else {
      return await prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: true,
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      })
    }
  },
}
