import { Context } from '../types/index'

export const Query = {
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null
    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    })
  },
  profile: async (
    _: any,
    { userId }: { userId: string },
    { prisma, userInfo }: Context
  ) => {
    const isMyProfile = +userId === userInfo?.userId

    const profile = await prisma.profile.findUnique({
      where: {
        userId: +userId,
      },
    })
    if (!profile) return null

    return {
      ...profile,
      isMyProfile,
    }
  },

  posts: async (_: any, __: any, { prisma }: Context) => {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          title: 'asc',
        },
      ],
    })

    return posts
  },
}
