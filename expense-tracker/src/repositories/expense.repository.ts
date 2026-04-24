import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ExpenseModel} from '../models';

export class ExpenseRepository extends DefaultCrudRepository<
  ExpenseModel,
  typeof ExpenseModel.prototype.id
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ExpenseModel, dataSource);
  }
}
