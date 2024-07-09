import { operatorTypes } from "../../../domain/enums/OperatorTypesEnum";
import { orderByTypes } from "../../../domain/enums/OrderByTypesEnum";
import { joinTypes } from "../../../domain/enums/JoinTypesEnum";
import { SQLBuilder } from "../../../domain/services/SQLBuilderServices";

enum Fields {
  ID = "id",
  NAME = "name",
  AGE = "age",
}

const builder = new SQLBuilder<Fields>();

describe("SQLBuilder", () => {
  it("should build a basic SELECT query", () => {
    const query = builder.buildSelectQuery("users", {});

    expect(query).toBe("SELECT * FROM users");
  });

  it("should build a SELECT query with fields", () => {
    const query = builder.buildSelectQuery("users", {
      select: [Fields.ID, Fields.NAME],
    });

    expect(query).toBe("SELECT id, name FROM users");
  });

  it("should build a SELECT query with WHERE clause", () => {
    const query = builder.buildSelectQuery("users", {
      where: [
        { field: Fields.AGE, operator: operatorTypes.GREATER_THAN, value: 18 },
      ],
    });

    expect(query).toBe("SELECT * FROM users WHERE age > '18'");
  });

  it("should build a SELECT query with JOIN clause", () => {
    const query = builder.buildSelectQuery("users", {
      join: [
        {
          type: joinTypes.INNER,
          table: "orders",
          on: "users.id = orders.user_id",
        },
      ],
    });

    expect(query).toBe(
      "SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id"
    );
  });

  it("should build a SELECT query with GROUP BY clause", () => {
    const query = builder.buildSelectQuery("users", {
      groupBy: [Fields.AGE],
    });

    expect(query).toBe("SELECT * FROM users GROUP BY age");
  });

  it("should build a SELECT query with ORDER BY clause", () => {
    const query = builder.buildSelectQuery("users", {
      orderBy: [{ field: Fields.NAME, direction: orderByTypes.ASC }],
    });

    expect(query).toBe("SELECT * FROM users ORDER BY name ASC");
  });

  it("should build a SELECT query with pagination", () => {
    const query = builder.buildSelectQuery("users", {
      pagination: { limit: 10, offset: 0 },
    });

    expect(query).toBe("SELECT * FROM users LIMIT 10 OFFSET 0");
  });

  it("should build a complex SELECT query with all clauses", () => {
    const query = builder.buildSelectQuery("users", {
      select: [Fields.ID, Fields.NAME],
      where: [
        { field: Fields.AGE, operator: operatorTypes.GREATER_THAN, value: 18 },
      ],
      join: [
        {
          type: joinTypes.LEFT,
          table: "orders",
          on: "users.id = orders.user_id",
        },
      ],
      groupBy: [Fields.AGE],
      orderBy: [{ field: Fields.NAME, direction: orderByTypes.ASC }],
      pagination: { limit: 5, offset: 2 },
    });

    expect(query).toBe(
      "SELECT id, name FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE age > '18' GROUP BY age ORDER BY name ASC LIMIT 5 OFFSET 2"
    );
  });

  it("should build a batch INSERT query", () => {
    const query = builder.buildInsertQuery("users", {
      data: [
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Bob", age: 25 },
        { id: 3, name: "Charlie", age: 35 },
      ],
    });

    expect(query).toBe(
      "INSERT INTO users (id, name, age) VALUES (1, 'Alice', '30'), (2, 'Bob', '25'), (3, 'Charlie', '35')"
    );
  });

  it("should build a batch UPDATE query", () => {
    const query = builder.buildUpdateQuery("users", {
      data: { name: "Alice" },
      where: [
        { field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 },
        { field: Fields.ID, operator: operatorTypes.EQUALS, value: 2 },
      ],
    });

    expect(query).toBe(
      "UPDATE users SET name = CASE WHEN id = '1' THEN 'Alice' WHEN id = '2' THEN 'Alice' ELSE name END WHERE id IN ('1', '2')"
    );
  });

  it("should build a batch DELETE query", () => {
    const query = builder.buildDeleteQuery("users", {
      where: [
        { field: Fields.ID, operator: operatorTypes.EQUALS, value: 1 },
        { field: Fields.ID, operator: operatorTypes.EQUALS, value: 2 },
        { field: Fields.ID, operator: operatorTypes.EQUALS, value: 3 },
      ],
    });

    expect(query).toBe("DELETE FROM users WHERE id IN ('1', '2', '3')");
  });
});
