
type FetchParams = Parameters<typeof fetch>
export const fetcher = (...args: FetchParams) => {
  return fetch(...args).then(res => res.json())
};
