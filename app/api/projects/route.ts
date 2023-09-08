import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { JsonFromResponse } from "@/app/lib/types";

export type GetProjectsResponse = JsonFromResponse<typeof GET>

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return new NextResponse<null>(null, {status: 400});
  }

  const projects = await prisma.project.findMany({
    where: {
      boardId
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc"
    }
  });

  return NextResponse.json(projects);
}
