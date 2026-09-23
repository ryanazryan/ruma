import { getBrands } from '@/api/brands'
import { BrandsPage } from '@/components/marketplace/BrandsPage'

export const dynamic = 'force-dynamic'

export default async function BrandsRoute() {
    const brands = await getBrands()

    return <BrandsPage brands={brands} />
}