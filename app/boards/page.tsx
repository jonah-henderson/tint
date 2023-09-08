"use client"

import React from 'react'
import { Card, CardBody, Divider, Link, Skeleton, Spacer, Spinner } from '@nextui-org/react'

import useSWR from 'swr'
import { fetcher } from '../lib/fetcher'
import { GetBoardsResponse } from '@/app/api/types'
import CardSkeleton from '../components/CardSkeleton'
import { bgGradientFromColour } from '../lib/colours'
import CreateBoard from './CreateBoard'
import ErrorBox from '../components/ErrorBox'

export default function BoardList() {

  const { data: boards, error, isLoading } = useSWR<GetBoardsResponse>(`/api/boards`, fetcher);

  if (error) {
    return <ErrorBox>
      <p>An error occurred:</p>
      <p>{JSON.stringify(error, undefined, 4)}</p>
    </ErrorBox>
  }

  const boardsLoaded = !isLoading && !!boards

  return (<main className='w-full'>
    <h1 className="text-xl p-4">Boards</h1>
    <Divider />
    <div className="flex flex-row flex-wrap gap-2 p-4">
      {
        boardsLoaded
          ? boards.map(board =>
            <a key={board.id} href={`/boards/${board.id}`}>
              <Card isPressable={true} className={`w-card-width h-card-height bg-gradient-to-br ${bgGradientFromColour[board.colour]}`}>
                <CardBody>
                  {board.name}
                </CardBody>
              </Card>
            </a>)
          : <CardSkeleton />
      }
      <CreateBoard />
    </div>
  </main>)

}
