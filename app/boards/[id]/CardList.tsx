import { useContext } from "react";
import { MdMenu } from "react-icons/md";
import { Button, CardFooter, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner } from "@nextui-org/react";
import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { Divider } from "@nextui-org/divider"
import { Draggable, DraggableChildrenFn, Droppable } from "@hello-pangea/dnd";

import { CreateCardInput } from "@/app/api/types";
import { useList } from "@/app/lib/hooks";
import { del, post } from "@/app/lib/request";
import { BoardIdContext, ListIdContext } from "@/app/lib/context";

import AppCard from "./AppCard";
import CreateCard from "./CreateCard";
import { useSWRConfig } from "swr";

export interface CardListProps {
  listId: string
  renderClone: DraggableChildrenFn
}

export default function CardList(props: CardListProps) {

  const boardId = useContext(BoardIdContext);
  const { mutate: globalMutate } = useSWRConfig();
  const { data: list, error, isLoading, mutate } = useList(props.listId);

  if (error) {
    return null;
  }

  async function handleCardCreate(cardCreateInput: CreateCardInput) {
    await post("/api/cards", cardCreateInput);
    mutate();
  }

  async function handleListDelete() {
    await del(`/api/lists/${props.listId}`);
    globalMutate(`/api/boards/${boardId}`);
  }

  const isListLoaded = !isLoading && list;
  return isListLoaded
    ? <Card isBlurred>
      <CardHeader>
        <p>{list.name}</p>
        <span className="flex-1" />
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly={true} variant="light">
              <MdMenu />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onClick={handleListDelete} color="danger" className="text-danger">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </CardHeader>
      <Divider />

      <CardBody className="p-4 gap-2">
        <Droppable droppableId={list.id} renderClone={props.renderClone}>{
          (provided) =>
            <div ref={provided.innerRef} {...provided.droppableProps} className="min-w-card-width min-h-card-height">
              <ListIdContext.Provider value={list.id}>
                {list.cards.map((card, index) =>
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) =>
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <AppCard key={card.id} cardId={card.id} />
                      </div>
                    }
                  </Draggable>)}
                {provided.placeholder}
              </ListIdContext.Provider>
            </div>
        }
        </Droppable>
      </CardBody>

      <Divider />

      <CardFooter>
        <CreateCard onCardCreated={cardInputData => handleCardCreate({ ...cardInputData, listId: list.id })} />
      </CardFooter>

    </Card >
    : <Spinner />
}
