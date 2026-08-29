import { Link } from 'react-router-dom'

export function Component() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold">页面不存在</h1>
        <p className="mt-2 text-sm text-muted-foreground">当前地址没有对应的结算业务页面。</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          返回结算概览
        </Link>
      </div>
    </main>
  )
}
