'use client'

import CardSkeleton from "@/app/components/CardSkeleton"
import { useCard } from "@/app/lib/hooks"
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react"
import { Card as AppCard } from "@prisma/client"
import CardDetails from "./CardDetails"
import { MdMenu } from "react-icons/md"
import { del } from "@/app/lib/request"
import { useSWRConfig } from "swr"
import { ListIdContext } from "@/app/lib/context"
import { useContext } from "react"
import { bgGradientFromColour } from "@/app/lib/colours"

export interface AppCardProps {
  cardId: string
}

export default function AppCard({ cardId }: AppCardProps) {
  const listId = useContext(ListIdContext);
  const { data: card, error, isLoading } = useCard(cardId);
  const { mutate } = useSWRConfig();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function handleCardDelete() {
    await del(`/api/cards/${cardId}`);
    mutate(`/api/lists/${listId}`);
  }

  if (error) {
    return null;
  }
  const isDataLoaded = !isLoading && card;
  return isDataLoaded
    ? <Card className="w-card-width min-h-card-height">
      <CardHeader>
        <p>{card.project.name}-{card.readableId}</p>
        <span className="flex-1" />
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly={true} variant="light">
              <MdMenu />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={onOpen}>
              Details
            </DropdownItem>
            <DropdownItem onClick={handleCardDelete} color="danger" className="text-danger">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <CardBody>
        {card.summary}
      </CardBody>
      <CardFooter className="gap-1 flex flex-wrap">
        {card.tags.map(tag => <Chip key={tag.id} className={`bg-gradient-to-br ${bgGradientFromColour[tag.colour]}`}>{tag.name}</Chip>)}
      </CardFooter>
      <CardDetails cardId={cardId} isOpen={isOpen} onOpenChange={onOpenChange} />
    </Card>
    : <CardSkeleton />
}
