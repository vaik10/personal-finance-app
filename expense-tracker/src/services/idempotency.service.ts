type CachedResponse = {
  requestHash: string;
  response: any;
};

export class IdempotencyService {
  private store = new Map<string, CachedResponse>();

  get(key: string): CachedResponse | undefined {
    return this.store.get(key);
  }

  set(key: string, value: CachedResponse): void {
    this.store.set(key, value);
  }
}