"use client"

import { MdMenu } from "react-icons/md"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { IconContext } from "react-icons"
import { useRouter } from "next/navigation"

export default function NavigationBar() {
  const router = useRouter()

  return (
    <nav className="bg-slate-800 flex flex-row gap-2 p-4 items-center">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly={true} variant="ghost">
            <IconContext.Provider value={{ size: "2em" }}>
              <MdMenu />
            </IconContext.Provider>
          </Button>
        </DropdownTrigger>
        <DropdownMenu onAction={() => router.push('/boards')}>
          <DropdownItem key="board">
            <p>Boards</p>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </nav>
  )
}
