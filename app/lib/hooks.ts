import useSWR from "swr";
import { fetcher } from "./fetcher";
import { GetBoardResponse, GetListResponse, GetProjectsResponse, GetTagsResponse } from "../api/types";
import { GetCardResponse } from "../api/types";


export function useCard(cardId: string) {
  return useSWR<GetCardResponse>(`/api/cards/${cardId}`, fetcher);
}

export function useList(listId: string) {
  return useSWR<GetListResponse>(`/api/lists/${listId}`, fetcher, {keepPreviousData: true});
}

export function useBoard(boardId: string) {
  return useSWR<GetBoardResponse>(`/api/boards/${boardId}`, fetcher);
}

export function useProjects(boardId: string) {
  return useSWR<GetProjectsResponse>(`/api/projects?boardId=${boardId}`, fetcher);
}

export function useTags(boardId: string) {
  return useSWR<GetTagsResponse>(`/api/tags?boardId=${boardId}`, fetcher);
}
