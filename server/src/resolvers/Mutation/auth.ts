import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
import validator from 'validator'
import { Context, SigninArgs, SignupArgs, UserPayload } from '../../types/index'
import { JSON_SIGNATURE } from '../keys'

export const authResolvers = {
  signUp: async (
    _: any,
    { name, credentials, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials
    const isEmail = validator.isEmail(email)

    if (!isEmail) {
      return {
        userErrors: [
          {
            message: 'Invalid Email',
          },
        ],
        token: null,
      }
    }

    const isValidPassword = validator.isLength(password, {
      min: 5,
    })

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: 'Invalid Password',
          },
        ],
        token: null,
      }
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: 'Invalid Password',
          },
        ],
        token: null,
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userCreated = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    await prisma.profile.create({
      data: {
        bio,
        userId: userCreated.id,
      },
    })

    const token = await JWT.sign(
      {
        userId: userCreated.id,
      },
      JSON_SIGNATURE,
      {
        expiresIn: 3600,
      }
    )

    return {
      userErrors: [],
      token,
    }
  },

  signIn: async (
    _: any,
    { credentials }: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return {
        userErrors: [
          {
            message: 'Invalid credentials',
          },
        ],
        token: null,
      }
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return {
        userErrors: [
          {
            message: 'Passwords do not match',
          },
        ],
        token: null,
      }
    }

    return {
      userErrors: [],
      token: await JWT.sign({ userId: user.id }, JSON_SIGNATURE, {
        expiresIn: 36000,
      }),
    }
  },
}
