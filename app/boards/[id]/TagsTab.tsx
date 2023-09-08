import CardSkeleton from '@/app/components/CardSkeleton';
import ErrorBox from '@/app/components/ErrorBox';
import { bgGradientFromColour } from '@/app/lib/colours';
import { BoardIdContext } from '@/app/lib/context'
import { useTags } from '@/app/lib/hooks';
import { Card, CardBody, Chip } from '@nextui-org/react';
import React, { useContext } from 'react'

export default function ProjectsTab() {

  const boardId = useContext(BoardIdContext);
  const { data: tags, error, isLoading } = useTags(boardId);

  const tagsLoaded = !isLoading && !!tags;

  if (error) {
    return <ErrorBox>
      An error occurred while loading tags.
    </ErrorBox>
  }

  if (!tagsLoaded) {
    return <CardSkeleton />
  }

  return (
    <div className="max-w-screen-md mx-auto mt-24">
      <Card>
        <CardBody className="flex gap-2 flex-col">
          {tags.map(tag => {
            return <Chip key={tag.id} className={`bg-gradient-to-br ${bgGradientFromColour[tag.colour]}`}>{tag.name}</Chip>
          })}
        </CardBody>
      </Card>
    </div>
  )
}
