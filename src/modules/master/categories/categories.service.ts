import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import Category from 'src/entities/category.entity';
import { QueryListDto } from './dto/query-list.dto';
import { PageOptionsDto } from 'src/common/dto/page-option.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const code = await this.categoryRepository.autoGenerateCode();
    const newCategory = new Category();
    newCategory.code = code;
    newCategory.name = createCategoryDto.name;
    newCategory.createdBy = userId;
    return this.categoryRepository.save(newCategory);
  }

  findAll(query: QueryListDto,pageOptionsDto:PageOptionsDto) {
    return this.categoryRepository.findCategories(query,pageOptionsDto);
  }

  findCasheer(query: QueryListDto) {
    return this.categoryRepository.findCategoriesCasheer(query);
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category Not Found');
    category.name = updateCategoryDto?.name;
    category.updatedBy = userId;
    return this.categoryRepository.save(category);
  }

  async remove(id: number, userId: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category Not Found');
    category.deletedBy = userId;
    await this.categoryRepository.save(category);
    return this.categoryRepository.softDelete(id);
  }
}
