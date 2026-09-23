import { notFound } from 'next/navigation'

import { getBrandBySlug } from '@/api/brands'
import { BrandDetail } from '@/components/marketplace/BrandDetail'

export const dynamic = 'force-dynamic'

interface BrandDetailPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function BrandDetailPage({
    params,
}: BrandDetailPageProps) {
    const { slug } = await params

    try {
        const data = await getBrandBySlug(slug)

        return (
            <BrandDetail
                brand={data.brand}
                products={data.products}
            />
        )
    } catch {
        notFound()
    }
}