import { FindAllParams } from "../../../application/dtos/FindAllParams";
import { FindByIdParams } from "../../../application/dtos/FindByIdParams";
import { FindManyParams } from "../../../application/dtos/FindManyParams";
import { FindOneParams } from "../../../application/dtos/FindOneParams";
import { ReplaceParams } from "../../../application/dtos/ReplaceParams";
import { UpsertParams } from "../../../application/dtos/UpsertParams";
import { Repository } from "../../../application/services/RepositoryService";
import { BatchInsertParams } from "../../../domain/dtos/BatchInsertParams";
import { DeleteParams } from "../../../domain/dtos/DeleteParams";
import { InsertParams } from "../../../domain/dtos/InsertParams";
import { UpdateParams } from "../../../domain/dtos/UpdateParams";
import { operatorTypes } from "../../../domain/enums/OperatorTypesEnum";
import { SQLManager } from "../../../domain/services/SQLManagerService";
import { Mapper } from "../../../infrastructure/database/mappers/Mapper";

enum Fields {
  ID = "id",
  NAME = "name",
  AGE = "age",
}

describe("Repository", () => {
  interface DbModel {
    id: number;
    name: string;
  }

  interface DomainEntity {
    id: number;
    fullName: string;
  }

  const mapFunction = (dbModel: DbModel): DomainEntity => ({
    id: dbModel.id,
    fullName: dbModel.name,
  });

  let sqlManager: SQLManager<Fields>;
  let mapper: Mapper<DbModel, DomainEntity>;
  let repository: Repository<DbModel, Fields, DomainEntity>;

  beforeEach(() => {
    sqlManager = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      batchInsert: jest.fn(),
      executeTransaction: jest.fn(),
    } as unknown as SQLManager<Fields>;
    mapper = new Mapper(mapFunction);
    repository = new Repository(sqlManager, "testTable", mapper);
  });

  it("should find by id", async () => {
    const params: FindByIdParams = { id: 1 };
    const dbModel: DbModel = { id: 1, name: "Test" };
    (sqlManager.select as jest.Mock).mockResolvedValue([dbModel]);

    const result = await repository.findById(params);
    expect(result).toEqual({ id: 1, fullName: "Test" });
  });

  it("should find one", async () => {
    const params: FindOneParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    const dbModel: DbModel = { id: 1, name: "Test" };
    (sqlManager.select as jest.Mock).mockResolvedValue([dbModel]);

    const result = await repository.findOne(params);
    expect(result).toEqual({ id: 1, fullName: "Test" });
  });

  it("should find many", async () => {
    const params: FindManyParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    const dbModels: DbModel[] = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];
    (sqlManager.select as jest.Mock).mockResolvedValue(dbModels);

    const results = await repository.findMany(params);
    expect(results).toEqual([
      { id: 1, fullName: "Test1" },
      { id: 2, fullName: "Test2" },
    ]);
  });

  it("should find all", async () => {
    const params: FindAllParams<Fields> = {};
    const dbModels: DbModel[] = [
      { id: 1, name: "Test1" },
      { id: 2, name: "Test2" },
    ];
    (sqlManager.select as jest.Mock).mockResolvedValue(dbModels);

    const results = await repository.findAll(params);
    expect(results).toEqual([
      { id: 1, fullName: "Test1" },
      { id: 2, fullName: "Test2" },
    ]);
  });

  it("should create many", async () => {
    const params: InsertParams<Fields> = {
      data: [{ id: 1, name: "Test1" }],
    };

    await repository.createMany(params);
    expect(sqlManager.insert).toHaveBeenCalledWith("testTable", params);
  });

  it("should update many", async () => {
    const params: UpdateParams<Fields> = {
      data: { name: "UpdatedName" },
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };

    await repository.updateMany(params);
    expect(sqlManager.update).toHaveBeenCalledWith("testTable", params);
  });

  it("should delete many", async () => {
    const params: DeleteParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };

    await repository.deleteMany(params);
    expect(sqlManager.delete).toHaveBeenCalledWith("testTable", params);
  });

  it("should batch create", async () => {
    const params: BatchInsertParams<Fields> = {
      data: [{ id: 1, name: "Test1" }],
      batchSize: 1,
    };

    await repository.batchCreate(params);
    expect(sqlManager.batchInsert).toHaveBeenCalledWith("testTable", params);
  });

  it("should upsert", async () => {
    const params: UpsertParams<Fields> = {
      find: {
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
      },
      update: {
        data: { name: "UpdatedName" },
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
      },
      create: {
        data: [{ id: 1, name: "CreatedName" } as Record<string, any>],
      },
    };

    (sqlManager.select as jest.Mock).mockResolvedValue([]);

    await repository.upsert(params);
    expect(sqlManager.executeTransaction).toHaveBeenCalled();
  });

  it("should replace", async () => {
    const params: ReplaceParams<Fields> = {
      delete: {
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
      },
      create: {
        data: [{ id: 1, name: "ReplacedName" } as Record<string, any>],
      },
    };

    await repository.replace(params);
    expect(sqlManager.executeTransaction).toHaveBeenCalled();
  });
});
