export type PagePropsWithSearchParams = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>
}