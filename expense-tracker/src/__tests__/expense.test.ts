import {createRestAppClient, expect} from '@loopback/testlab';
import {ExpenseTrackerApplication} from '../application';

describe('Expense API', () => {
  let app: ExpenseTrackerApplication;
  let client: any;

  before(async () => {
    app = new ExpenseTrackerApplication();
    await app.boot();
    await app.start();

    client = createRestAppClient(app);
  });

  after(async () => {
    await app.stop();
  });

  it('creates an expense', async () => {
    const res = await client
      .post('/expenses')
      .send({
        amount: 10,
        category: 'food',
        date: '2026-04-24',
      })
      .expect(200);

    expect(res.body).to.have.property('id');
    expect(res.body.amount).to.equal(1000); // paise
  });

  it('handles idempotency correctly', async () => {
    const key = 'test-key-123';

    const payload = {
        amount: 20,
        category: 'travel',
        date: '2026-04-24',
    };

    const first = await client
        .post('/expenses')
        .set('Idempotency-Key', key)
        .send(payload)
        .expect(200);

    const second = await client
        .post('/expenses')
        .set('Idempotency-Key', key)
        .send(payload)
        .expect(200);

    // ✅ SAME response expected
    expect(first.body.id).to.equal(second.body.id);
    });

  it('filters expenses by category', async () => {
    const res = await client
      .get('/expenses?category=food')
      .expect(200);

    expect(res.body.data).to.be.an.Array();
  });
});