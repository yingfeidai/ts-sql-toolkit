import { BatchInsertParams } from "../../domain/dtos/BatchInsertParams";
import { DeleteParams } from "../../domain/dtos/DeleteParams";
import {
  BatchExecutionErrorResult,
  ExecutionResult,
} from "../../domain/dtos/ExecutionResult";
import { InsertParams } from "../../domain/dtos/InsertParams";
import { UpdateParams } from "../../domain/dtos/UpdateParams";
import { operatorTypes } from "../../domain/enums/OperatorTypesEnum";
import { SQLManager } from "../../domain/services/SQLManagerService";
import { WhereOptionsType } from "../../domain/types/WhereOptionsType";
import { Mapper } from "../../infrastructure/database/mappers/Mapper";
import { FindAllParams } from "../dtos/FindAllParams";
import { FindByIdParams } from "../dtos/FindByIdParams";
import { FindManyParams } from "../dtos/FindManyParams";
import { FindOneParams } from "../dtos/FindOneParams";
import { ReplaceParams } from "../dtos/ReplaceParams";
import { UpsertParams } from "../dtos/UpsertParams";
import { IRepository } from "../interfaces/IRepository";

export class Repository<DbModel, FieldsEnum extends string, DomainEntity>
  implements IRepository<FieldsEnum, DomainEntity>
{
  constructor(
    protected readonly sqlManager: SQLManager<FieldsEnum>,
    protected readonly tableName: string,
    protected readonly mapper: Mapper<DbModel, DomainEntity>
  ) {}

  async findById(params: FindByIdParams): Promise<DomainEntity | null> {
    const results = await this.sqlManager.select(this.tableName, {
      where: [
        {
          field: "id",
          operator: operatorTypes.EQUALS,
          value: params.id,
        } as WhereOptionsType<FieldsEnum>,
      ],
    });
    if (results.length === 0) {
      return null;
    }
    return this.mapper.toDomainEntity(results[0]);
  }

  async findOne(
    params: FindOneParams<FieldsEnum>
  ): Promise<DomainEntity | null> {
    const results = await this.sqlManager.select(this.tableName, { ...params });
    if (results.length === 0) {
      return null;
    }
    return this.mapper.toDomainEntity(results[0]);
  }

  async findMany(params: FindManyParams<FieldsEnum>): Promise<DomainEntity[]> {
    const results = await this.sqlManager.select(this.tableName, { ...params });
    return results.map((result) => this.mapper.toDomainEntity(result));
  }

  async findAll(params: FindAllParams<FieldsEnum>): Promise<DomainEntity[]> {
    const results = await this.sqlManager.select(this.tableName, { ...params });
    return results.map((result) => this.mapper.toDomainEntity(result));
  }

  async createMany(params: InsertParams<FieldsEnum>): Promise<void> {
    return this.sqlManager.insert(this.tableName, params);
  }

  async updateMany(params: UpdateParams<FieldsEnum>): Promise<ExecutionResult> {
    return this.sqlManager.update(this.tableName, {
      ...params,
    });
  }

  async deleteMany(params: DeleteParams<FieldsEnum>): Promise<ExecutionResult> {
    return this.sqlManager.delete(this.tableName, { ...params });
  }

  async batchCreate(
    params: BatchInsertParams<FieldsEnum>
  ): Promise<BatchExecutionErrorResult<FieldsEnum>> {
    return this.sqlManager.batchInsert(this.tableName, params);
  }

  async upsert(params: UpsertParams<FieldsEnum>): Promise<void> {
    await this.sqlManager.executeTransaction([
      async () => {
        const existingRecords = await this.sqlManager.select(this.tableName, {
          ...params.find,
        });
        if (existingRecords.length > 0) {
          await this.sqlManager.update(this.tableName, {
            ...params.update,
          });
        } else {
          await this.sqlManager.insert(this.tableName, {
            ...params.create,
          });
        }
      },
    ]);
  }

  async replace(params: ReplaceParams<FieldsEnum>): Promise<void> {
    await this.sqlManager.executeTransaction([
      async () => {
        await this.sqlManager.delete(this.tableName, params.delete);
        await this.sqlManager.insert(this.tableName, params.create);
      },
    ]);
  }
}
