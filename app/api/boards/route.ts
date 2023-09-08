import { NextResponse } from "next/server";
import { defaultBoardProjection, prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";
import { Colour, Prisma } from "@prisma/client";

export type GetBoardsResponse = JsonFromResponse<typeof GET>

export async function GET(req: Request) {
  const boards = await prisma.board.findMany();
  return NextResponse.json(boards);
}

export interface CreateBoardInput {
  name: string,
  colour: string
}
export type CreateBoardResponse = JsonFromResponse<typeof POST>
export async function POST(req: Request) {

  // TODO: use an API or validation lib to enforce stricter constraints on request bodies
  const body = await req.json() as CreateBoardInput;

  const boardColour = (() => {
    switch (body.colour) {
      case "RED": return Colour.RED;
      case "ORANGE": return Colour.ORANGE;
      case "YELLOW": return Colour.YELLOW;
      case "GREEN": return Colour.GREEN;
      case "BLUE": return Colour.BLUE;
      case "PURPLE": return Colour.PURPLE;
      default: return Colour.BLUE
    }
  })()

  const boardCreateInput: Prisma.BoardCreateInput = {
    name: body.name,
    colour: boardColour,
    projects: {
      create: [
        {name: "Default"}
      ]
    },
    tags: {
      create: [
        {name: "Red", colour: Colour.RED},
        {name: "Orange", colour: Colour.ORANGE},
        {name: "Yellow", colour: Colour.YELLOW},
        {name: "Green", colour: Colour.GREEN},
        {name: "Blue", colour: Colour.BLUE},
        {name: "Purple", colour: Colour.PURPLE},
      ]
    }
  }

  const newBoard = await prisma.board.create({data: boardCreateInput, select: defaultBoardProjection});

  return NextResponse.json(newBoard);
}
