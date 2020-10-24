import { getCustomRepository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class CreateTransactionService {
  public async execute(id: string): Promise<void> {
    const validate = uuidValidate(id);
    if (!validate) {
      throw new AppError('Invalid uuid.');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const result = await transactionsRepository.findOne(id);

    if (!result) {
      throw new AppError('uuid not found.');
    }

    await transactionsRepository.delete(id);
  }
}

export default CreateTransactionService;
