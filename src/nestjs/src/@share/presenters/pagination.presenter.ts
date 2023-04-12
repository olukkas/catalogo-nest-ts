import { Transform } from 'class-transformer';

export type PaginationProps = {
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
};

export class PaginationPresenter {
  @Transform(({ value }) => parseInt(value))
  current_page: number;

  @Transform(({ value }) => parseInt(value))
  per_page: number;

  @Transform(({ value }) => parseInt(value))
  last_page: number;

  @Transform(({ value }) => parseInt(value))
  total: number;

  constructor(props: PaginationProps) {
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = props.last_page;
    this.total = props.total;
  }
}
