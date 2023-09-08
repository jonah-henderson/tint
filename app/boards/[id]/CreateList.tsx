import { useEffect, useRef, useState } from "react";
import { Card, CardBody } from "@nextui-org/card"
import { Button, Input } from "@nextui-org/react"
import { IconContext } from "react-icons"
import { MdAdd, MdClose } from "react-icons/md"

export interface CardListProps {
  onCreateList: (listName: string) => unknown
}

export default function CardList({ onCreateList }: CardListProps) {

  const [isAddingNewList, setIsAddingNewList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null)

  function createList() {
    const listName = inputRef.current?.value
    if (listName) {
      inputRef.current.value = ""
      onCreateList(listName);
    }
  }

  useEffect(() => inputRef.current?.focus(), [isAddingNewList]);

  const addListContent = <div className="flex flex-col gap-1">
    <Input
      variant="bordered"
      label="List name"
      ref={inputRef}
    /*onBlur={() => setIsAddingNewList(false)}*/
    />
    <div className="flex flex-row">
      <Button onPress={createList}>
        Create list
      </Button>
      <Button isIconOnly variant="bordered" onPress={() => setIsAddingNewList(false)} className="border-none">
        <MdClose />
      </Button>
    </div>
  </div>

  return (
    <Card
      isPressable={!isAddingNewList}
      className="min-w-card-width bg-white/30 "
      onPress={() => setIsAddingNewList(true)}
    >
      <CardBody className="flex flex-row">
        <IconContext.Provider value={{ size: "1.5em" }}>
          {!isAddingNewList && <>
            <MdAdd />
            <p>Create list</p>
          </>}
          {isAddingNewList && addListContent}
        </IconContext.Provider>
      </CardBody>
    </Card>
  )
}
