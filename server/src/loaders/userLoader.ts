import { BatchUser } from '@/types'
import Dataloader from 'dataloader'
import { prisma } from '../index'
import { User } from '@prisma/client'

/**
 * It takes an array of user ids, fetches the users from the database, and returns an array of users in
 * the same order as the ids
 * @param ids - The array of ids that we want to resolve.
 * @returns An array of users
 */
const batchUsers: BatchUser = async (ids) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  /**
   @params [{id:2}, {id:1}, {id:3}]
   @returns {
    1: {id:1},
    2: {id:2},
    3: {id:3}
   }
   * 
   */

  const userMap: { [key: string]: User } = {}

  users.forEach((user) => {
    userMap[user.id] = user
  })

  return ids.map((id) => userMap[id])
}

//@ts-ignore
export const userLoader = new Dataloader<number, User>(batchUsers)
