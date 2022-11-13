export enum SortType {
  DESC = 'DESC',
  ASC = 'ASC',
}

export enum Operator {
  EQ = '=',
  MT = '>',
  LT = '<',
  MTEQ = '>=',
  LTEQ = '<=',
  LIKE = 'like',
  BETWEEN = 'between',
}

export interface Sort {
  target: string;
  order: SortType;
}

export interface Condition {
  target: string;
  operator: Operator;
  value: any;
}

export interface PageableDto {
  pageNo: number;

  fields: [];

  pageSize: number;

  sortBy: Sort;

  condition: Condition[];
}
