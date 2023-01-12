import { Context, ProfileParentType } from '@/types'

export const Profile = {
  user: async (
    parent: ProfileParentType,
    __: any,
    { prisma, userInfo }: Context
  ) => {
    return prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    })
  },
}
