import {model, property} from '@loopback/repository';
import {BaseEntity} from './base.model';

@model()
export class ExpenseModel extends BaseEntity {
  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
    },
  })
  amount: number; // stored in paise

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  constructor(data?: Partial<ExpenseModel>) {
    super(data);
  }
}