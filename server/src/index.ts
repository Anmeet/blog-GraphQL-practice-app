import { Context } from '@/types'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { Mutation, Query, Profile, Post, User } from './resolvers'
import { typeDefs } from './schema'
import { getUserFromToken } from './utils/getUserFromToken'

export const prisma = new PrismaClient()

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
    Profile,
    Post,
    User,
  },
  context: async ({ req }: any): Promise<Context> => {
    const userInfo = await getUserFromToken(req.headers.authorization)
    return {
      prisma,
      userInfo,
    }
  },
})

server.listen().then(({ url }) => {
  console.log('`Server listening on' + url)
})
