import { Card, CardBody, CardHeader } from '@nextui-org/react'
import React, { ReactNode } from 'react'

export interface ErrorBoxProps {
  children: ReactNode
}
export default function ErrorBox({ children }: ErrorBoxProps) {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <Card>
        <CardHeader>
          <h1 className="font-semibold">Error</h1>
        </CardHeader>
        <CardBody>
          {children}
        </CardBody>
      </Card>
    </div>
  )
}
