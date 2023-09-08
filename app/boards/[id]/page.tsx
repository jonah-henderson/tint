'use client'
import { useState } from "react"
import { Spinner } from "@nextui-org/react"

import Toggle from "@/app/components/Toggle"
import { bgGradientFromColour } from "@/app/lib/colours"
import { BoardIdContext } from "@/app/lib/context"
import { useBoard } from "@/app/lib/hooks"

import BoardHeader, { BoardTab } from "./BoardHeader"
import ListsTab from "./ListsTab"
import ProjectsTab from "./ProjectsTab"
import SettingsTab from "./SettingsTab"
import TagsTab from "./TagsTab"

export default function Home({ params }: { params: { id: string } }) {

  const { data: board, error, isLoading } = useBoard(params.id);
  const [selectedTab, setSelectedTab] = useState<BoardTab>(BoardTab.Lists);

  if (error) {
    return <div>Error!</div>
  }

  if (isLoading) {
    return <div className="flex w-full h-full items-center justify-center"><Spinner /></div>
  }

  if (!board) {
    return <div>Something is wrong!</div>
  }

  return (
    <main className={`w-full bg-gradient-to-br ${bgGradientFromColour[board.colour]}`}>
      <BoardIdContext.Provider value={board.id}>
        <BoardHeader name={board.name} onSelectedTabChanged={setSelectedTab} selectedTab={selectedTab} />
        <Toggle show={selectedTab === BoardTab.Lists}>
          <ListsTab listIds={board.lists.map(list => list.id)} />
        </Toggle>
        <Toggle show={selectedTab === BoardTab.Projects}>
          <ProjectsTab />
        </Toggle>
        <Toggle show={selectedTab === BoardTab.Tags}>
          <TagsTab />
        </Toggle>
        <Toggle show={selectedTab === BoardTab.Settings}>
          <SettingsTab />
        </Toggle>
      </BoardIdContext.Provider>
    </main>
  )
}
