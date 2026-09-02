import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_ROUTE = 'isPublicRoute'
// 只有显式标记的接口才能绕过全局 JWT 守卫。
export const Public = () => SetMetadata(IS_PUBLIC_ROUTE, true)
