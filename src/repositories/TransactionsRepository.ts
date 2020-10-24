import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    // try object spread operator
    /* eslint-disable no-param-reassign */
    const { income, outcome } = transactions.reduce(
      (accomulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accomulator.income += transaction.value;
            break;
          case 'outcome':
            accomulator.outcome += transaction.value;
            break;
          default:
            break;
        }

        return accomulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    /* eslint-disable no-param-reassign */

    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
