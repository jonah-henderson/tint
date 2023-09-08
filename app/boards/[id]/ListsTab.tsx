import { DragDropContext, DraggableChildrenFn, OnDragEndResponder } from '@hello-pangea/dnd'
import React, { useContext } from 'react'

import { UpdateListReorderInput, CreateListInput, GetListResponse, UpdateListResponse } from '@/app/api/types'
import { BoardIdContext } from '@/app/lib/context'
import CardList from './CardList'
import CreateList from './CreateList'
import { get, patch, post } from '@/app/lib/request'
import AppCard from './AppCard'
import { useSWRConfig } from 'swr'
import { UpdateListMoveCardInput } from '@/app/api/types'

interface ListsTabProps {
  listIds: string[]
}

function arrayReorder(array: any[], from: number, to: number) {
  const temp = array[to];
  array[to] = array[from];
  array[from] = temp;
  return array;
}

export default function ListsTab({ listIds }: ListsTabProps) {

  const { mutate } = useSWRConfig();
  const boardId = useContext(BoardIdContext);

  async function handleCreateList(listName: string) {
    const createListInput: CreateListInput = {
      name: listName,
      boardId
    }
    await post('/api/lists', createListInput);
    mutate(`/api/boards/${boardId}`);
  }

  function handleReorderCardInList(listId: string, cardId: string, fromIndex: number, toIndex: number) {
    const listReorderInput: UpdateListReorderInput = {
      reorder: {
        cardId,
        fromIndex,
        toIndex
      }
    };

    const key = `/api/lists/${listId}`;
    const mutation = async () => patch(key, listReorderInput);

    mutate(key, mutation, {
      optimisticData: data => {
        const cachedListData = data as GetListResponse;
        const optimisticData: GetListResponse = {
          ...cachedListData,
          cards: arrayReorder([...cachedListData.cards], fromIndex, toIndex)
        }
        return optimisticData;
      },
      revalidate: false
    });
    return;
  }

  function handleMoveCardBetweenLists(fromListId: string, toListId: string, cardId: string, toIndex: number) {

    const moveCardInput: UpdateListMoveCardInput = {
      moveCard: {
        cardId,
        toIndex,
        toListId
      }
    };

    const fromListKey = `/api/lists/${fromListId}`;
    const toListKey = `/api/lists/${toListId}`;

    const patchPromise = patch<UpdateListMoveCardInput, UpdateListResponse>(fromListKey, moveCardInput);

    const mutateFromList = async () => patchPromise
    const mutateToList = async () => {
      await patchPromise;
      return get(toListKey);
    }

    mutate(toListKey, mutateToList, {
      optimisticData: cachedData => {
        const cachedList = cachedData as GetListResponse;
        const optimisticCards = [...cachedList.cards]
        optimisticCards.splice(toIndex, 0, { id: cardId })
        const optimisticToList: GetListResponse = {
          ...cachedList,
          cards: optimisticCards
        };
        return optimisticToList;
      },
      revalidate: false
    });

    mutate(fromListKey, mutateFromList, {
      optimisticData: cachedData => {
        const cachedList = cachedData as GetListResponse;
        const optimisticFromList: GetListResponse = {
          ...cachedList,
          cards: cachedList.cards.filter(card => card.id !== cardId)
        };
        return optimisticFromList;
      },
      revalidate: false
    });
  }

  const renderCard: DraggableChildrenFn = (provided, snapshot, rubric) => {
    const id = rubric.draggableId;
    return <div  {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} >
      <AppCard cardId={id} />
    </div>
  }

  const handleDragEnd: OnDragEndResponder = async (result, provided) => {
    const movedCardId = result.draggableId;
    const source = result.source;
    const destination = result.destination;

    if (result.reason === "CANCEL" || !destination) {
      // No meaningful change, leave as is
      return;
    }

    if (source.droppableId === destination.droppableId && source.index !== destination.index) {
      // Reorder one card within a list
      handleReorderCardInList(destination.droppableId, movedCardId, source.index, destination.index);
    }

    if (source.droppableId !== destination.droppableId) {
      // Move a card from one list to another
      handleMoveCardBetweenLists(source.droppableId, destination.droppableId, movedCardId, destination.index);
    }
  }

  return (
    <div className="flex flex-row gap-4 items-start p-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        {listIds.map(id =>
          <CardList
            key={id}
            listId={id}
            renderClone={renderCard}
          />
        )}
        <CreateList onCreateList={handleCreateList} />
      </DragDropContext>
    </div>
  )
}
