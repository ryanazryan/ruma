import { CategoryNav } from '@/components/layout/CategoryNav'
import { Header } from '@/components/layout/Header'

export default function MarketplaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
        <CategoryNav />
      </div>

      {children}
    </>
  )
}