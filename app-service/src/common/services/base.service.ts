import {
  BaseEntity,
  Between,
  DeleteResult,
  Equal,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { IBaseService } from './ibase.service';
import { EntityId } from 'typeorm/repository/EntityId';
import { LoggerService } from '../logger/logger.service';
import { arrayNotEmpty } from 'class-validator';
import { Operator } from '../dto/pageable.dto';

export class BaseService<T extends BaseEntity, R extends Repository<T>>
  implements IBaseService<T>
{
  protected readonly repository: R;
  protected readonly logger: LoggerService;

  constructor(repository: R, logger: LoggerService) {
    this.repository = repository;
    this.logger = logger;
  }

  index(): Promise<T[]> {
    return this.repository.find();
  }

  findById(id: any): Promise<T> {
    return this.repository.findOne(id);
  }

  findByIds(ids: [EntityId]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  store(data: any): Promise<T> {
    return this.repository.save(data);
  }

  async update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  delete(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  /**
   * Get List
   * @param paginate
   * @return Promise<{ record: T[]; totalRecord: number }>
   */
  async findAll(paginate): Promise<{ record: T[]; totalRecord: number }> {
    const order = this.convertSort(paginate);
    const condition = this.convertCondition(paginate);
    if (paginate.userId) {
      condition['user'] = paginate.userId;
    }
    const skip = (paginate.pageNo - 1) * paginate.pageSize;
    const [record, totalRecord] = await this.repository.findAndCount({
      select: arrayNotEmpty(paginate.fields) ? paginate.fields : null,
      where: condition,
      order: order,
      take: paginate.pageSize,
      skip: skip,
    });
    return { record, totalRecord };
  }

  convertCondition(data) {
    const where = {};
    if (data.condition) {
      data.condition.forEach((element) => {
        switch (element.operator) {
          case Operator.EQ: {
            where[element.target] = Equal(element.value);
            break;
          }
          case Operator.MT: {
            where[element.target] = MoreThan(element.value);
            break;
          }
          case Operator.LT: {
            where[element.target] = LessThan(element.value);
            break;
          }
          case Operator.MTEQ: {
            where[element.target] = MoreThanOrEqual(element.value);
            break;
          }
          case Operator.LTEQ: {
            where[element.target] = LessThanOrEqual(element.value);
            break;
          }
          case Operator.LIKE: {
            where[element.target] = Like('%' + element.value + '%');
            break;
          }
          case Operator.BETWEEN: {
            const valueBetween = element.value.split(',');
            if (valueBetween.length == 2) {
              where[element.target] = Between(valueBetween[0], valueBetween[1]);
            }
            break;
          }
          default: {
            break;
          }
        }
      });
    }
    return where;
  }

  convertSort(sort) {
    const order = {};
    if (sort.sortBy) {
      order[sort.sortBy.target] = sort.sortBy.order;
    }
    return order;
  }
}
