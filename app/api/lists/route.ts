import { NextResponse } from "next/server";
import { defaultListProjection, prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";

export type CreateListResponse = JsonFromResponse<typeof POST>
export interface CreateListInput {
  name: string,
  boardId: string
}

export async function POST(req: Request) {
  const body = await req.json() as CreateListInput;

  const board = await prisma.board.findUnique({where: {id: body.boardId}, include: {
    _count: {
      select: {lists: true}
    }
  }});

  if (!board) {
    return new NextResponse<null>(null, {status: 404})
  }

  const newList = await prisma.list.create({
    data: {
      index: board._count.lists,
      name: body.name,
      board: {
        connect: {
          id: board.id
        }
      }
    },
    select: defaultListProjection
  });

  return NextResponse.json(newList);
}

export type GetListsResponse = JsonFromResponse<typeof GET>

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return new NextResponse<null>(null, {status: 400});
  }

  const lists = await prisma.list.findMany({
    where: {
      boardId
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      index: "asc"
    }
  });

  return NextResponse.json(lists);
}
