import { CollectionPresenter } from '../collection.presenter';
import { PaginationPresenter } from '../pagination.presenter';
import { instanceToPlain } from 'class-transformer';

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('CollectionPresenter Unit Tests', function () {
  it('should set string number values', function () {
    const presenter = new StubCollectionPresenter({
      current_page: '1' as any,
      total: '2' as any,
      last_page: '3' as any,
      per_page: '4' as any,
    });

    expect(presenter['paginationPresenter']).toBeInstanceOf(
      PaginationPresenter,
    );
    expect(presenter.meta).toEqual(presenter['paginationPresenter']);

    expect(presenter['paginationPresenter'].current_page).toBe('1');
    expect(presenter['paginationPresenter'].total).toBe('2');
    expect(presenter['paginationPresenter'].last_page).toBe('3');
    expect(presenter['paginationPresenter'].per_page).toBe('4');
  });

  it('should convert to integer', function () {
    const presenter = new StubCollectionPresenter({
      current_page: '1.1' as any,
      total: '2.1' as any,
      last_page: '3.1' as any,
      per_page: '4.1' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [1, 2, 3],
      meta: {
        current_page: 1,
        total: 2,
        last_page: 3,
        per_page: 4,
      },
    });
  });
});
