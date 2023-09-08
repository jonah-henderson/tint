import { defaultBoardProjection, prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";
import { Colour, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

interface BoardRouteParams {
  params: {id: string}
}

export type GetBoardResponse = JsonFromResponse<typeof GET>

export async function GET(_req: Request, {params}: BoardRouteParams) {
  const prisma = new PrismaClient();

  const board = await prisma.board.findUnique({
    where: {id: params.id}, 
    select: defaultBoardProjection
  });

  if (!board) {
    return new NextResponse<null>(null, {status: 404});
  }

  return NextResponse.json<typeof board>(board);
}

export interface BoardUpdateInput {
  colour?: Colour;
  name?: string
}
export type UpdateBoardResponse = JsonFromResponse<typeof PATCH>
export async function PATCH(req: Request, {params}: BoardRouteParams) {

  const board = await prisma.board.findUnique({
    where: {id: params.id}
  });

  if (!board) {
    return new NextResponse<null>(null, {status: 404});
  }

  const body = await req.json();

  const input: BoardUpdateInput = {colour: undefined, name: undefined};

  for (let key of (Object.keys(input) as (keyof BoardUpdateInput)[])) {
    input[key] = body[key];
  }

  const updatedBoard = await prisma.board.update({
    where: {id: params.id},
    data: {
      ...input
    },
    select: defaultBoardProjection
  });

  return NextResponse.json(updatedBoard);
}

export async function DELETE(_req: Request, {params}: BoardRouteParams) {
  const deleted = await prisma.board.delete({
    where: {
      id: params.id
    }
  });

  return NextResponse.json({
    deleted: deleted.id
  });
}
