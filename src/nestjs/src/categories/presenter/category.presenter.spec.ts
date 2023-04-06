import { CategoryPresenter } from './category.presenter';
import { instanceToPlain } from 'class-transformer';

describe('CategoryPresenter Unit Test', function () {
  describe('constructor', function () {
    it('should set a value', function () {
      const now = new Date();
      const presenter = new CategoryPresenter({
        id: 'uuid',
        name: 'nome',
        description: 'desc',
        is_active: true,
        created_at: now,
      });

      expect(presenter.id).toBe('uuid');
      expect(presenter.name).toBe('nome');
      expect(presenter.description).toBe('desc');
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(now);
    });

    it('should present data', function () {
      const now = new Date();
      const presenter = new CategoryPresenter({
        id: 'uuid',
        name: 'nome',
        description: 'desc',
        is_active: true,
        created_at: now,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        id: 'uuid',
        name: 'nome',
        description: 'desc',
        is_active: true,
        created_at: now.toISOString(),
      });
    });
  });
});
