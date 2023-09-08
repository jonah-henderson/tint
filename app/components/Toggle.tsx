import React, { ReactNode } from 'react'

export interface ToggleProps {
  show: boolean,
  children: ReactNode
}
export default function Toggle({ show, children }: ToggleProps) {
  return (
    <span style={{ display: show ? "unset" : "none" }}>
      {children}
    </span>
  )
}
