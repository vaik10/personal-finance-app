import {Entity, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';

@model()
export class BaseEntity extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id: string;

  @property({
    type: 'date',
    required: true,
  })
  created_at: string;

  constructor(data?: Partial<BaseEntity>) {
    super(data);

    // Auto-generate id if not provided
    if (!this.id) {
      this.id = uuidv4();
    }

    // Auto-set created_at
    if (!this.created_at) {
      this.created_at = new Date().toISOString();
    }
  }
}