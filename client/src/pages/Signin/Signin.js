import React, { useState, useEffect } from 'react'

import { Form } from 'react-bootstrap'
import Button from '@restart/ui/esm/Button'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router'

const SIGNIN = gql`
  mutation Signin($email: String!, $password: String!) {
    signIn(credentials: { password: $password, email: $email }) {
      userErrors {
        message
      }
      token
    }
  }
`

export default function Signin() {
  const history = useHistory()
  const [signIn, { data, loading }] = useMutation(SIGNIN)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleClick = () => {
    signIn({
      variables: {
        email: email,
        password: password,
      },
    })
  }

  const [error, setError] = useState(null)

  useEffect(() => {
    if (data) {
      if (data.signIn.userErrors.length) {
        setError(data.signIn.userErrors[0].message)
      }
      if (data.signIn.token) {
        localStorage.setItem('token', data.signIn.token)
        history.push('/posts')
      }
    }
  }, [data])

  return (
    <div>
      <Form>
        <Form.Group className='mb-3'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder=''
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder=''
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        {error && <p>{error}</p>}
        <Button onClick={handleClick}>Signin</Button>
      </Form>
    </div>
  )
}
