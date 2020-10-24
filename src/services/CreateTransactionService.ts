import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    if (!['outcome', 'income'].includes(type)) {
      throw new AppError('Invalid transaction type.');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('Not enough balance.');
    }

    let tag = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!tag) {
      tag = categoriesRepository.create({ title: category });

      await categoriesRepository.save(tag);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: tag,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
