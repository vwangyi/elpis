export interface ApiClientOptions {
  baseUrl?: string
  getAccessToken?: () => string | null
  maxGetAttempts?: number
  retryDelay?: number
}

export interface ApiErrorBody {
  message?: string | string[]
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}

function getErrorMessage(body: unknown) {
  if (!body || typeof body !== 'object' || !('message' in body)) return null
  const message = (body as ApiErrorBody).message
  if (Array.isArray(message)) return message[0] ?? null
  return typeof message === 'string' ? message : null
}

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

export function createApiClient(options: ApiClientOptions = {}) {
  const baseUrl = options.baseUrl ?? '/api'
  const maxGetAttempts = options.maxGetAttempts ?? 5
  const retryDelay = options.retryDelay ?? 600

  return async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const method = (init.method ?? 'GET').toUpperCase()
    const maxAttempts = method === 'GET' ? maxGetAttempts : 1

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      let response: Response
      const token = options.getAccessToken?.()
      const headers = new Headers(init.headers)
      headers.set('Accept', 'application/json')
      if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
      if (token) headers.set('Authorization', `Bearer ${token}`)

      try {
        response = await fetch(joinUrl(baseUrl, path), { ...init, headers })
      } catch {
        if (attempt < maxAttempts) {
          await wait(retryDelay)
          continue
        }
        throw new ApiError('无法连接后端服务，请确认 API 服务已经启动')
      }

      const responseText = await response.text()
      if (!response.ok && !responseText && attempt < maxAttempts) {
        await wait(retryDelay)
        continue
      }

      let body: unknown = null
      if (responseText) {
        try {
          body = JSON.parse(responseText)
        } catch {
          throw new ApiError(
            response.ok ? '接口返回了无法解析的数据' : `请求失败（${response.status}）`,
            response.status,
          )
        }
      }

      if (!response.ok) {
        throw new ApiError(
          getErrorMessage(body) ?? `请求失败（${response.status}）`,
          response.status,
          body,
        )
      }
      if (body === null) throw new ApiError('接口没有返回业务数据', response.status)
      return body as T
    }

    throw new ApiError('无法连接后端服务，请稍后重试')
  }
}
