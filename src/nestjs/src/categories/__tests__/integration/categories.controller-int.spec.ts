import { CategoriesController } from '../../categories.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesModule } from '../../categories.module';

describe('CategoriesController integration tests', function () {
  let controller: CategoriesController;

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = modulo.get(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
