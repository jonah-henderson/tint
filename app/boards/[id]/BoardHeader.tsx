import { Tab, Tabs } from "@nextui-org/react"
import { Key, ReactNode } from "react"

export interface BoardHeaderProps {
  name: string
  selectedTab: BoardTab,
  onSelectedTabChanged: (newSelection: BoardTab) => unknown
}

function keyToTabEnum(key: Key) {
  switch (key) {
    case "lists": return BoardTab.Lists;
    case "projects": return BoardTab.Projects;
    case "tags": return BoardTab.Tags;
    case "settings": return BoardTab.Settings;
    default: return BoardTab.Lists
  }
}

export enum BoardTab {
  Lists = "lists",
  Projects = "projects",
  Tags = "tags",
  Settings = "settings"
}

export default function BoardHeader({ name, selectedTab, onSelectedTabChanged }: BoardHeaderProps) {
  return (
    <div className="px-4 pt-4 backdrop-blur-md bg-black/40 w-full">
      <div className="flex flex-col">
        <h1>{name}</h1>
        <Tabs
          variant="underlined"
          className="mx-auto"
          selectedKey={selectedTab}
          onSelectionChange={key => onSelectedTabChanged(keyToTabEnum(key))}
          classNames={{
            cursor: "w-full"
          }}>
          <Tab key="lists" title="Lists" />
          <Tab key="projects" title="Projects" />
          <Tab key="tags" title="Tags" />
          <Tab key="settings" title="Settings" />
        </Tabs>
      </div>
    </div>
  )
}
