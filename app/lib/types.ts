import { NextResponse } from "next/server"

export type PrimitivesOnly<T> = {
  [property in keyof T]: Exclude<T[property], object>
}

type UnwrapNextResponse<T> = T extends NextResponse<infer U> ? U : never

export type JsonFromResponse<T extends (...args: any[]) => any> = NonNullable<UnwrapNextResponse<Awaited<ReturnType<T>>>>
