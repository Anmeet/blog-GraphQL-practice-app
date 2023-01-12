import { PrismaClient, Prisma, Post, User } from '@prisma/client'

//backend Types
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
  userInfo: {
    userId: number
  } | null
}

export interface PostArgs {
  post: {
    title?: string
    content?: string
  }
}

export interface PostPayloadType {
  userErrors: {
    message: string
  }[]
  post: Post | null
}

export interface SignupArgs {
  credentials: {
    email: string
    password: string
  }

  name: string
  bio: string
}

export interface UserPayload {
  userErrors: {
    message: string
  }[]
  token: string | null
}

export interface SigninArgs {
  credentials: {
    email: string
    password: string
  }
}

export interface CanUserMutatePostParams {
  userId: number
  postId: number
  prisma: Context['prisma']
}

export interface ProfileParentType {
  id: number
  bio: string
  userId: number
}

export interface PostParentType {
  authorId: number
}

export interface UserParentType {
  id: number
}

export type BatchUser = (ids: number[]) => Promise<User[]>
