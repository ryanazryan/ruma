import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getCurrentUserWithCookie } from '@/lib/api'
import { AccountPage } from '@/components/account/AccountPage'

export const dynamic = 'force-dynamic'

export default async function AccountRoute() {
  const requestHeaders = await headers()
  const cookieHeader = requestHeaders.get('cookie') ?? ''

  try {
    const response = await getCurrentUserWithCookie(cookieHeader)
    const user = response.data.user

    return (
      <AccountPage
        profile={{
          fullName: user.fullName,
          email: user.email,
          joinDate: new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
          }).format(new Date(user.createdAt)),
        }}
      />
    )
  } catch {
    redirect('/login')
  }
}