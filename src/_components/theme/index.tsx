import type { ReactNode } from 'react'
import ColorMode from './color-mode'

interface ThemeProps {
  children?: ReactNode
}

function ThemeRoot({ children }: ThemeProps) {
  return <>{children}</>
}

const Theme = Object.assign(ThemeRoot, {
  ColorMode
})

export { ColorMode }
export default Theme
