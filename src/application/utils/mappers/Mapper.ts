import { IMapper } from "./IMapper";

export class Mapper<DbModel, DomainEntity>
  implements IMapper<DbModel, DomainEntity>
{
  constructor(
    private readonly mapFunction: (dbModel: DbModel) => DomainEntity
  ) {}

  toDomainEntity(dbModel: DbModel): DomainEntity {
    return this.mapFunction(dbModel);
  }
}
