import { Card, CardBody, Skeleton, Spacer } from '@nextui-org/react'
import React from 'react'

export default function CardSkeleton() {
  return (
    <Card className="w-card-width h-card-height">
      <CardBody className="space-y-3">
        <Skeleton className="rounded-lg h-6 w-2/5" />
        <Spacer y={6} />
        <Skeleton className="rounded-lg h-4 w-full" />
        <Skeleton className="rounded-lg h-4 w-full" />
        <Skeleton className="rounded-lg h-4 w-3/5" />
      </CardBody>
    </Card>
  )
}
