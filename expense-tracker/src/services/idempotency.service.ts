type IdempotencyRecord = {
  requestHash: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  response?: unknown;
};

export class IdempotencyService {
  private store = new Map<string, IdempotencyRecord>();

  get(key: string): IdempotencyRecord | undefined {
    return this.store.get(key);
  }

  set(key: string, value: IdempotencyRecord): void {
    this.store.set(key, value);
  }
}