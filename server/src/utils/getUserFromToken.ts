import { JSON_SIGNATURE } from '../resolvers/keys'
import JWT from 'jsonwebtoken'
export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, JSON_SIGNATURE) as {
      userId: number
    }
  } catch (error) {
    return null
  }
}
