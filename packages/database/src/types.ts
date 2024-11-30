export * from "./repositories";

export type QueryResponse<T> = {
  cursor: string;
  records: T[];
};

export type GetOptions = {
  consistentRead: boolean;
};
