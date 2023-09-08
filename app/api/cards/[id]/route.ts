import { defaultCardProjection, prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";
import { NextResponse } from "next/server";

interface CardRouteParams {
  params: {id: string}
}

export type GetCardResponse = JsonFromResponse<typeof GET>

export async function GET(req: Request, {params}: CardRouteParams) {
  const card = await prisma.card.findUnique({
    where: {id: params.id},
    select: defaultCardProjection
  });

  if (!card) {
    return new NextResponse<null>(null, {status: 404});
  }

  return NextResponse.json(card);
}

export type UpdateCardResponse = JsonFromResponse<typeof PATCH>

export interface UpdateCardInput {
  summary?: string;
  description?: string;
  tagIds?: string[];
  projectId?: string[];
}

export async function PATCH(req: Request, {params}: CardRouteParams) {
  const body = await req.json() as UpdateCardInput;

  // TODO: implement card updating
  return NextResponse.json({ok: true});
}

export async function DELETE(req: Request, {params}: CardRouteParams) {
  const deleted = await prisma.card.delete({
    where: {id: params.id}
  });
  if (!deleted) {
    return new NextResponse<null>(null, {status: 404});
  }
  return NextResponse.json({deleted: deleted.id});
}
