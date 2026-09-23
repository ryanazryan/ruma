import { CategoryNav } from '@/components/layout/CategoryNav'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'

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

      <div className="pb-16 lg:pb-0">
        {children}
      </div>

      <Footer />

      <MobileBottomNav />
    </>
  )
}