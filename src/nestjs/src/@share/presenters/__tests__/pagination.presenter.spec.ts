import { PaginationPresenter } from '../pagination.presenter';
import { instanceToPlain } from 'class-transformer';

describe('PaginationPresenter Unit Tests', function () {
  it('should set string number values', function () {
    const presenter = new PaginationPresenter({
      current_page: '1' as any,
      total: '2' as any,
      last_page: '3' as any,
      per_page: '4' as any,
    });

    expect(presenter.current_page).toBe('1');
    expect(presenter.total).toBe('2');
    expect(presenter.last_page).toBe('3');
    expect(presenter.per_page).toBe('4');
  });

  it('should convert to integer', function () {
    const presenter = new PaginationPresenter({
      current_page: '1.1' as any,
      total: '2.1' as any,
      last_page: '3.1' as any,
      per_page: '4.1' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      current_page: 1,
      total: 2,
      last_page: 3,
      per_page: 4,
    });
  });
});
