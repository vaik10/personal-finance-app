import {repository, Filter} from '@loopback/repository';
import {get, param, post, requestBody, response} from '@loopback/rest';
import {ExpenseModel} from '../models';
import {ExpenseRepository} from '../repositories';

export class ExpenseController {
  constructor(
    @repository(ExpenseRepository)
    public expenseRepository: ExpenseRepository,
  ) {}

  @get('/expenses')
  @response(200, {
    description: 'List of expenses',
    content: {'application/json': {schema: {type: 'array', items: {'x-ts-type': ExpenseModel}}}},
  })
  async getExpenses(
    @param.query.string('category') category?: string,
    @param.query.string('sort') sort?: string,
  ): Promise<ExpenseModel[]> {
    const filter: Filter<ExpenseModel> = {};

    // Filtering
    if (category) {
      filter.where = {
        category,
      };
    }

    // Sorting
    if (sort === 'date_desc') {
      filter.order = ['date DESC'];
    }

    return this.expenseRepository.find(filter);
  }

  @post('/expenses')
  @response(200, {
    description: 'Expense created successfully',
    content: {'application/json': {schema: {'x-ts-type': ExpenseModel}}},
  })
  async createExpense(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['amount', 'category', 'date'],
            properties: {
              amount: {type: 'number'},
              category: {type: 'string'},
              description: {type: 'string'},
              date: {type: 'string', format: 'date'},
            },
          },
        },
      },
    })
    body: {
      amount: number;
      category: string;
      description?: string;
      date: string;
    },
  ): Promise<ExpenseModel> {
    // Basic validation
    if (body.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Convert to paise (important)
    const amountInPaise = Math.round(body.amount * 100);

    const expense = new ExpenseModel({
      amount: amountInPaise,
      category: body.category,
      description: body.description,
      date: body.date,
    });

    return this.expenseRepository.create(expense);
  }
}