import { Button } from '@supply-chain/ui-react'
import { RefreshCw } from 'lucide-react'

export default function PageHeader({
  title,
  description,
  loading,
  onRefresh,
}: {
  title: string
  description: string
  loading?: boolean
  onRefresh: () => void
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Button variant="outline" disabled={loading} onClick={onRefresh}>
        <RefreshCw className="mr-2" size={16} />
        刷新数据
      </Button>
    </header>
  )
}
