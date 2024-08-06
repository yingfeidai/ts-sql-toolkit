import { FindAllParams } from "../../../src/application/dtos/FindAllParams";
import { FindByIdParams } from "../../../src/application/dtos/FindByIdParams";
import { FindManyParams } from "../../../src/application/dtos/FindManyParams";
import { FindOneParams } from "../../../src/application/dtos/FindOneParams";
import { ReplaceParams } from "../../../src/application/dtos/ReplaceParams";
import { UpsertParams } from "../../../src/application/dtos/UpsertParams";
import { Repository } from "../../../src/application/services/RepositoryService";
import { BatchInsertParams } from "../../../src/domain/dtos/BatchInsertParams";
import { DeleteParams } from "../../../src/domain/dtos/DeleteParams";
import { InsertParams } from "../../../src/domain/dtos/InsertParams";
import { UpdateParams } from "../../../src/domain/dtos/UpdateParams";
import { operatorTypes } from "../../../src/domain/enums/OperatorTypesEnum";
import { SQLManager } from "../../../src/domain/services/SQLManagerService";
import { Mapper } from "../../../src/infrastructure/database/mappers/Mapper";

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

  let sqlManager: jest.Mocked<SQLManager<Fields>>;
  let mapper: Mapper<DbModel, DomainEntity>;
  let repository: Repository<DbModel, Fields, DomainEntity>;

  const dbModel: DbModel = { id: 1, name: "Test" };
  const dbModels: DbModel[] = [
    { id: 1, name: "Test1" },
    { id: 2, name: "Test2" },
  ];

  beforeEach(() => {
    sqlManager = {
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      batchInsert: jest.fn(),
      executeTransaction: jest.fn(),
    } as unknown as jest.Mocked<SQLManager<Fields>>;

    mapper = new Mapper(mapFunction);
    repository = new Repository(sqlManager, "testTable", mapper);
  });

  it("should find by id", async () => {
    const params: FindByIdParams = { id: 1 };
    sqlManager.select.mockResolvedValue([dbModel]);

    const result = await repository.findById(params);
    expect(result).toEqual({ id: 1, fullName: "Test" });
  });

  it("should handle error when finding by id", async () => {
    const params: FindByIdParams = { id: 1 };
    sqlManager.select.mockRejectedValue(new Error("Database error"));

    await expect(repository.findById(params)).rejects.toThrow("Database error");
  });

  it("should find one", async () => {
    const params: FindOneParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    sqlManager.select.mockResolvedValue([dbModel]);

    const result = await repository.findOne(params);
    expect(result).toEqual({ id: 1, fullName: "Test" });
  });

  it("should handle error when finding one", async () => {
    const params: FindOneParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    sqlManager.select.mockRejectedValue(new Error("Database error"));

    await expect(repository.findOne(params)).rejects.toThrow("Database error");
  });

  it("should find many", async () => {
    const params: FindManyParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    sqlManager.select.mockResolvedValue(dbModels);

    const results = await repository.findMany(params);
    expect(results).toEqual([
      { id: 1, fullName: "Test1" },
      { id: 2, fullName: "Test2" },
    ]);
  });

  it("should handle error when finding many", async () => {
    const params: FindManyParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    sqlManager.select.mockRejectedValue(new Error("Database error"));

    await expect(repository.findMany(params)).rejects.toThrow("Database error");
  });

  it("should find all", async () => {
    const params: FindAllParams<Fields> = {};
    sqlManager.select.mockResolvedValue(dbModels);

    const results = await repository.findAll(params);
    expect(results).toEqual([
      { id: 1, fullName: "Test1" },
      { id: 2, fullName: "Test2" },
    ]);
  });

  it("should handle error when finding all", async () => {
    const params: FindAllParams<Fields> = {};
    sqlManager.select.mockRejectedValue(new Error("Database error"));

    await expect(repository.findAll(params)).rejects.toThrow("Database error");
  });

  it("should create many", async () => {
    const params: InsertParams<Fields> = {
      data: [{ id: 1, name: "Test1" }],
    };

    await repository.createMany(params);
    expect(sqlManager.insert).toHaveBeenCalledWith("testTable", params);
  });

  it("should handle error when creating many", async () => {
    const params: InsertParams<Fields> = {
      data: [{ id: 1, name: "Test1" }],
    };
    sqlManager.insert.mockRejectedValue(new Error("Database error"));

    await expect(repository.createMany(params)).rejects.toThrow(
      "Database error"
    );
  });

  it("should update many", async () => {
    const params: UpdateParams<Fields> = {
      data: { name: "UpdatedName" },
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };

    await repository.updateMany(params);
    expect(sqlManager.update).toHaveBeenCalledWith("testTable", params);
  });

  it("should handle error when updating many", async () => {
    const params: UpdateParams<Fields> = {
      data: { name: "UpdatedName" },
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    sqlManager.update.mockRejectedValue(new Error("Database error"));

    await expect(repository.updateMany(params)).rejects.toThrow(
      "Database error"
    );
  });

  it("should delete many", async () => {
    const params: DeleteParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };

    await repository.deleteMany(params);
    expect(sqlManager.delete).toHaveBeenCalledWith("testTable", params);
  });

  it("should handle error when deleting many", async () => {
    const params: DeleteParams<Fields> = {
      where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
    };
    sqlManager.delete.mockRejectedValue(new Error("Database error"));

    await expect(repository.deleteMany(params)).rejects.toThrow(
      "Database error"
    );
  });

  it("should batch create", async () => {
    const params: BatchInsertParams<Fields> = {
      data: [{ id: 1, name: "Test1" }],
      batchSize: 1,
    };

    await repository.batchCreate(params);
    expect(sqlManager.batchInsert).toHaveBeenCalledWith("testTable", params);
  });

  it("should handle error when batch creating", async () => {
    const params: BatchInsertParams<Fields> = {
      data: [{ id: 1, name: "Test1" }],
      batchSize: 1,
    };
    sqlManager.batchInsert.mockRejectedValue(new Error("Database error"));

    await expect(repository.batchCreate(params)).rejects.toThrow(
      "Database error"
    );
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

    sqlManager.select.mockResolvedValue([]);

    await repository.upsert(params);
    expect(sqlManager.executeTransaction).toHaveBeenCalled();
  });

  it("should handle error when upserting", async () => {
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

    sqlManager.select.mockRejectedValue(new Error("Database error"));

    await expect(repository.upsert(params)).rejects.toThrow("Database error");
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

  it("should handle error when replacing", async () => {
    const params: ReplaceParams<Fields> = {
      delete: {
        where: [{ field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 }],
      },
      create: {
        data: [{ id: 1, name: "ReplacedName" } as Record<string, any>],
      },
    };

    sqlManager.executeTransaction.mockRejectedValue(
      new Error("Database error")
    );

    await expect(repository.replace(params)).rejects.toThrow("Database error");
  });
});
