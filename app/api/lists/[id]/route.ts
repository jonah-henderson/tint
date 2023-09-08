import { defaultListProjection, prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";
import { NextResponse } from "next/server";

interface ListRouteParams {
  params: {id: string}
}

export type GetListResponse = JsonFromResponse<typeof GET>

export async function GET(_req: Request, {params}: ListRouteParams) {
  const list = await prisma.list.findUnique({
    where: {id: params.id},
    select: defaultListProjection
  });

  if (!list) {
    return new NextResponse<null>(null, {status: 404});
  }

  return NextResponse.json(list);
}

export async function DELETE(req: Request, {params}: ListRouteParams) {
  const deleted = await prisma.list.delete({
    where: {id: params.id}
  });

  return NextResponse.json({deleted: deleted.id});
}

export type UpdateListResponse = JsonFromResponse<typeof PATCH>

export interface UpdateListReorderInput {
  reorder: {cardId: string, fromIndex: number, toIndex: number};
}

export interface UpdateListMoveCardInput {
  moveCard: {cardId: string, toListId: string, toIndex: number};
}

type ListUpdate = UpdateListReorderInput | UpdateListMoveCardInput

function isReorder(update: ListUpdate): update is UpdateListReorderInput {
  return (update as UpdateListReorderInput).reorder !== undefined;
}

function isMove(update: ListUpdate): update is UpdateListMoveCardInput {
  return (update as UpdateListMoveCardInput).moveCard !== undefined;
}

export async function PATCH(req: Request, {params}: ListRouteParams) {
  const body = await req.json() as ListUpdate;

  if (isReorder(body)) {
    const updatedList = await prisma.list.reorderCard(params.id, body.reorder.cardId, body.reorder.toIndex);
    if (!updatedList) {
      return new NextResponse<null>(null, {status: 404});
    }
    return NextResponse.json(updatedList);
  }

  if (isMove(body)) {
    const updatedList = await prisma.list.moveCard(
      params.id, 
      body.moveCard.toListId, 
      body.moveCard.cardId, 
      body.moveCard.toIndex
    );

    if (!updatedList) {
      return new NextResponse<null>(null, {status: 404});
    }

    return NextResponse.json(updatedList);
  }

  const list = await prisma.list.findUnique({
    where: {
      id: params.id
    },
    select: defaultListProjection
  });

  if (!list) {
    return new NextResponse<null>(null, {status: 404});
  }

  return NextResponse.json(list);
}
