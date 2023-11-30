import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

const Test = async () => {
    const session = await getServerSession(authOptions);

  return (
    <main>

        <div>Test</div>
        <div>{JSON.stringify(session)}</div>
    </main>
  )
}

export default Test