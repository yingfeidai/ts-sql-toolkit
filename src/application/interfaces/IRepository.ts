// import {
//   FindByIdInput,
//   FindOneInput,
//   FindManyInput,
//   FindAllInput,
//   CreateInput,
//   UpdateInput,
//   DeleteInput,
//   BatchCreateInput,
//   AffectedRows,
//   UpsertInput,
//   ReplaceInput,
// } from "../dtos/repository.dto";

import { BatchInsertParams } from "../../domain/dtos/BatchInsertParams";
import { DeleteParams } from "../../domain/dtos/DeleteParams";
import {
  BatchExecutionErrorResult,
  ExecutionResult,
} from "../../domain/dtos/ExecutionResult";
import { InsertParams } from "../../domain/dtos/InsertParams";
import { UpdateParams } from "../../domain/dtos/UpdateParams";
import { FindAllParams } from "../dtos/FindAllParams";
import { FindByIdParams } from "../dtos/FindByIdParams";
import { FindManyParams } from "../dtos/FindManyParams";
import { FindOneParams } from "../dtos/FindOneParams";
import { ReplaceParams } from "../dtos/ReplaceParams";
import { UpsertParams } from "../dtos/UpsertParams";

export interface IRepository<FieldsEnum extends string, DomainEntity> {
  findById(params: FindByIdParams): Promise<DomainEntity | null>;
  findOne(params: FindOneParams<FieldsEnum>): Promise<DomainEntity | null>;
  findMany(params: FindManyParams<FieldsEnum>): Promise<DomainEntity[]>;
  findAll(params: FindAllParams<FieldsEnum>): Promise<DomainEntity[]>;
  createMany(params: InsertParams<FieldsEnum>): Promise<void>;
  updateMany(params: UpdateParams<FieldsEnum>): Promise<ExecutionResult>;
  deleteMany(params: DeleteParams<FieldsEnum>): Promise<ExecutionResult>;
  batchCreate(
    params: BatchInsertParams<FieldsEnum>
  ): Promise<BatchExecutionErrorResult<FieldsEnum>>;
  upsert(params: UpsertParams<FieldsEnum>): Promise<void>;
  replace(params: ReplaceParams<FieldsEnum>): Promise<void>;
}
