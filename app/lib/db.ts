import { Prisma, PrismaClient } from "@prisma/client";

// Prevent multiple instances of the Prisma client from being created
// in order to prevent performance problems (see link)
// https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/instantiate-prisma-client

const globalForPrisma = globalThis as unknown as { prisma: ExtendedPrisma }

export const prisma =
  globalForPrisma.prisma || extendPrisma();

type ExtendedPrisma = ReturnType<typeof extendPrisma>;
function extendPrisma() {
  return new PrismaClient().$extends({
    name: "kanbanExtensions",
    model: {
      list: {
        reorderCard,
        moveCard
      }
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Frequently used projections

export const defaultBoardProjection = {
  id: true,
  name: true,
  colour: true,
  lists: {
    select: {id: true},
    orderBy: {index: "asc" as Prisma.SortOrder}
  }
};

export const defaultListProjection = {
  id: true,
  name: true,
  cards: {
    select: {id: true},
    orderBy: {index: "asc" as Prisma.SortOrder}
  }
};

export const defaultCardProjection = {
  id: true,
  summary: true,
  description: true,
  readableId: true,
  project: {
    select: {id: true, name: true},
  },
  tags: {
    select: {id: true, name: true, colour: true}
  }
}

// Model extensions

async function moveCard(fromListId: string, toListId: string, cardId: string, toIndex: number) {

  const fromListPromise = prisma.list.findUnique({
    where: {id: fromListId},
    include: {cards: {select: {id: true, index: true}, orderBy: {index: "asc"}}}
  });
  const toListPromise = prisma.list.findUnique({
    where: {id: toListId}
  });
  const cardPromise = prisma.card.findUnique({
    where: {id: cardId}
  });

  const [fromList, toList, cardToMove] = await Promise.all([fromListPromise, toListPromise, cardPromise]);

  if (!fromList || !toList || !cardToMove) {
    return;
  }

  const fromIndex = cardToMove.index;

  // First decrease the indices of all subsequent cards in the "from" list
  const updateFromCardsPromise = prisma.card.updateMany({
    where: {
      listId: fromListId,
      id: {not: cardId},
      index: {
        gt: fromIndex
      }
    },
    data: {
      index: {
        decrement: 1
      }
    }
  });

  // Then increase the indices of all cards after the target index in the "to" list
  const updateToCardsPromise = prisma.card.updateMany({
    where: {
      listId: toListId,
      index: {
        gte: toIndex
      }
    },
    data: {
      index: {
        increment: 1
      }
    }
  });

  // Finally change the card's list connection
  const updateMovedCardPromise = prisma.card.update({
    where: {
      id: cardId
    },
    data: {
      list: {
        connect: {id: toListId}
      },
      index: toIndex
    }
  });

  await Promise.all([updateFromCardsPromise, updateToCardsPromise, updateMovedCardPromise]);

  const updatedFromList = await prisma.list.findUnique({
    where: {
      id: fromListId
    },
    select: defaultListProjection
  });

  return updatedFromList;
}

async function reorderCard(listId: string, cardId: string, newIndex: number) {
  const list = await prisma.list.findUnique({
    where: {id: listId},
    include: {
      cards: {select: {id: true, index: true}, orderBy: {index: "asc"}},
    },
  })

  if (!list) {
    return;
  }
  
  const cardToMove = list.cards.find(card => card.id === cardId);

  if (!cardToMove) {
    return;
  }

  const oldIndex = cardToMove.index;
  
  if (oldIndex === newIndex) {
    return list;
  }

  const isMovingTowardsFront = newIndex < oldIndex;
  let frontIndex = 0;
  let backIndex = 0;
  let operation: {increment?: number, decrement?: number} = {};

  if (isMovingTowardsFront) {
    // e.g. moving from index 7 to 2
    //   - cards 2, 3, 4, 5, and 6 need to have their index increased
    operation = {increment: 1};
    frontIndex = newIndex;
    backIndex = oldIndex - 1;
  }
  else {
    // e.g. moving from index 2 to 7
    //   - cards 3, 4, 5, 6, and 7 need to have their index decreased
    operation = {decrement: 1};
    frontIndex = oldIndex + 1;
    backIndex = newIndex;
  }

  const updateOtherCardsPromise = prisma.card.updateMany({
    where: {
      listId: list.id,
      id: {
        not: cardToMove.id
      },
      index: {
        gte: frontIndex,
        lte: backIndex
      }
    },
    data: {
      index: operation
    }
  });

  const updateMovedCardPromise = prisma.card.update({
    where: {
      id: cardToMove.id
    },
    data: {
      index: newIndex
    }
  });
    
  await Promise.all([updateOtherCardsPromise, updateMovedCardPromise]);

  const updatedList = await prisma.list.findUnique({
    where: {
      id: listId
    },
    select: defaultListProjection
  });

  return updatedList;
}
