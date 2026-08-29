import {
  getResolvedTheme,
  initializeTheme,
  THEME_CHANGE_EVENT,
  toggleTheme,
  type ResolvedTheme,
} from '@supply-chain/design-tokens/theme'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from './button'

export function ThemeToggle() {
  const [theme, setTheme] = useState<ResolvedTheme>(() => getResolvedTheme())

  useEffect(() => {
    setTheme(initializeTheme())
    const syncTheme = () => setTheme(getResolvedTheme())
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme)
  }, [])

  const label = theme === 'dark' ? '切换为浅色主题' : '切换为深色主题'

  return (
    <Button
      variant="outline"
      size="sm"
      className="size-9 px-0"
      aria-label={label}
      onClick={() => setTheme(toggleTheme())}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  )
}
