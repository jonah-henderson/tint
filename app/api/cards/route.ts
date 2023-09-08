import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { defaultCardProjection, prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";

export interface CreateCardInput {
  summary: string;
  description: string;
  listId: string;
  projectId: string;
  tagIds: string[]
}

export type CreateCardResponse = JsonFromResponse<typeof POST>

export async function POST(req: Request) {
  const body = await req.json() as CreateCardInput;

  const listPromise = prisma.list.findUnique({where: {id: body.listId}, include: {
    _count: {
      select: {cards: true}
    }
  }});

  const projectPromise = prisma.project.findUnique({where: {id: body.projectId}});

  const [list, project] = await Promise.all([listPromise, projectPromise]);

  if (!list || !project) {
    return new NextResponse<null>(null, {status: 404})
  }

  const cardCreateInput: Prisma.CardCreateInput = {
    summary: body.summary,
    description: body.description,
    index: list._count.cards,
    readableId: project.nextCardId,
    project: {
      connect: {id: project.id}
    },
    list: {
      connect: {
        id: list.id
      }
    },
    tags: {
      connect: body.tagIds.map(id => ({id}))
    }
  }

  const newCard = await prisma.card.create({data: cardCreateInput, select: defaultCardProjection});

  prisma.project.update({
    where: {id: project.id},
    data: {
      nextCardId: {
        increment: 1
      }
    }
  }).then(
    // .then() is needed to start the promise execution
    
    // Although we don't have anything we want to do with the result just yet,
    // eventually it would make sense to detect failures and use it to roll
    // back changes
  );

  return NextResponse.json(newCard);
}

export type GetCardsResponse = JsonFromResponse<typeof GET>

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return new NextResponse<null>(null, {status: 400});
  }

  const cards = await prisma.card.findMany({
    where: {
      list: {
        boardId
      }
    },
    select: defaultCardProjection,
    orderBy: {
      index: "asc"
    }
  });

  return NextResponse.json(cards);
}


