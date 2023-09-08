import CardSkeleton from '@/app/components/CardSkeleton';
import ErrorBox from '@/app/components/ErrorBox';
import { BoardIdContext } from '@/app/lib/context'
import { useProjects } from '@/app/lib/hooks'
import { Card, CardBody } from '@nextui-org/react';
import React, { useContext } from 'react'

export default function ProjectsTab() {

  const boardId = useContext(BoardIdContext);
  const { data: projects, error, isLoading } = useProjects(boardId);

  const projectsLoaded = !isLoading && !!projects;


  if (error) {
    return <ErrorBox>
      An error occurred while loading projects.
    </ErrorBox>
  }

  if (!projectsLoaded) {
    return <CardSkeleton />
  }

  return (
    <div className="max-w-screen-md mx-auto mt-24">
      <Card>
        <CardBody className="flex gap-2">
          {projects.map(project => {
            return project.name
          })}
        </CardBody>
      </Card>
    </div>
  )
}
