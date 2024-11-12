import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { NotFoundException } from '@nestjs/common';
import { BrandRepository } from 'src/repositories/brand.repository';
import Brand from 'src/entities/brand.entity';

export const BrandRepositoryMock = {
  createBrand: jest.fn(),
  findBrands: jest.fn(),
  findOneBy: jest.fn(),
};

describe('BrandsService', () => {
  let service: BrandsService;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        { provide: BrandRepository, useValue: BrandRepositoryMock },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a brand', async () => {
    const createBrandDto: CreateBrandDto = {
      name: 'Test Brand',
      code: 'TB',
    };

    const brand = new Brand();
    brand.code = createBrandDto.code;
    brand.name = createBrandDto.name;

    BrandRepositoryMock.createBrand.mockResolvedValue({ ...brand, id: 1 });

    const result = await service.create(createBrandDto, 1);
    expect(result).toHaveProperty('id');
    expect(result.name).toEqual(createBrandDto.name);
    expect(result.code).toEqual(createBrandDto.code);
  });

  it('should throw an error if the brand does not exist', async () => {
    BrandRepositoryMock.findOneBy.mockResolvedValue(null);
    await expect(
      service.update(999, { name: 'Test Brand Updated' }, 1),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if the brand is not found', async () => {
    BrandRepositoryMock.findOneBy.mockResolvedValue(null);
    await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
  });
});
