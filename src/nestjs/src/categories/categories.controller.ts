import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Put,
  HttpCode,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryPresenter } from './presenter/category.presenter';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase.UseCase)
  private createUseCase: CreateCategoryUseCase.UseCase;

  @Inject(UpdateCategoryUseCase.UseCase)
  private updateUseCase: UpdateCategoryUseCase.UseCase;

  @Inject(DeleteCategoryUseCase.UseCase)
  private deleteUseCase: DeleteCategoryUseCase.UseCase;

  @Inject(GetCategoryUseCase.UseCase)
  private getUseCase: GetCategoryUseCase.UseCase;

  @Inject(ListCategoriesUseCase.UseCase)
  private listUseCase: ListCategoriesUseCase.UseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);

    return new CategoryPresenter(output);
  }

  @Get()
  search(@Query() searchParams: SearchCategoryDto) {
    return this.listUseCase.execute(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUseCase.execute({ id });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.updateUseCase.execute({
      id,
      ...updateCategoryDto,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteUseCase.execute({ id });
  }
}
