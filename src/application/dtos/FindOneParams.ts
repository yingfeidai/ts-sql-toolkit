import { WhereOptionsType } from "../../domain/types/WhereOptionsType";

export type FindOneParams<T> = {
  where?: WhereOptionsType<T>[];
};
