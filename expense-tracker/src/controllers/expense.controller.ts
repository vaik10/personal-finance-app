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
  ): Promise<{data: ExpenseModel[]; total: number}> {
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
    const expenses = await this.expenseRepository.find(filter);
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
    data: expenses,
    total,
  };
  }

  @post('/expenses')
  @response(200, {
    description: 'Expense created successfully',
    content: {'application/json': {schema: {'x-ts-type': ExpenseModel}}},
  })
  async createExpense(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['amount', 'category', 'date'],
            properties: {
              amount: {
                type: 'number',
                minimum: 0.01,
                description: 'Amount in rupees',
              },
              category: {
                type: 'string',
                minLength: 1,
              },
              description: {
                type: 'string',
                maxLength: 255,
              },
              date: {
                type: 'string',
                format: 'date',
              },
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