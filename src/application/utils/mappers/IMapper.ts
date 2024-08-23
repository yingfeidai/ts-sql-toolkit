export interface IMapper<DbModel, DomainEntity> {
  toDomainEntity(dbModel: DbModel): DomainEntity
}
