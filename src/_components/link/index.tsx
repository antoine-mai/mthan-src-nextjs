import NextLink from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type LinkProps = ComponentPropsWithoutRef<typeof NextLink>

export default function Link({ className = '', ...props }: LinkProps) {
  return (
    <NextLink
      {...props}
      className={['transition', className].filter(Boolean).join(' ')}
    />
  )
}
