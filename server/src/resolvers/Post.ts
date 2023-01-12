import { Context, PostParentType } from '@/types'
import { userLoader } from '../loaders/userLoader'

export const Post = {
  user: async (
    parent: PostParentType,
    __: any,
    { prisma, userInfo }: Context
  ) => {
    return userLoader.load(parent.authorId)
  },
}
