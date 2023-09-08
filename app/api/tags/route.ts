import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";

export type GetTagsResponse = JsonFromResponse<typeof GET>

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return new NextResponse<null>(null, {status: 400});
  }

  const tags = await prisma.tag.findMany({
    where: {
      boardId
    },
    select: {
      id: true,
      name: true,
      colour: true,
    },
    orderBy: {
      name: "asc"
    }
  });

  return NextResponse.json(tags);
}
