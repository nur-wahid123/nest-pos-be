import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
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

  it('should find all brands', async () => {
    const result = await service.findAll({}, { take: 10, skip: 0 });
    expect(result).toHaveProperty('data');
    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: expect.any(Number) }),
      ]),
    );
    expect(result.pagination).toEqual(
      expect.objectContaining({
        itemCount: expect.any(Number),
        totalItems: expect.any(Number),
        itemsPerPage: expect.any(Number),
        totalPages: expect.any(Number),
        currentPage: expect.any(Number),
      }),
    );
  });

  it('should find one brand', async () => {
    const result = await service.findOne(1);
    expect(result).toHaveProperty('id');
    expect(result.name).toEqual('Test Brand');
    expect(result.code).toEqual('Test Code');
  });

  it('should update a brand', async () => {
    const updateBrandDto: UpdateBrandDto = {
      name: 'Test Brand Updated',
      code: 'Test brand description updated',
    };

    const result = await service.update(1, updateBrandDto, 1);
    expect(result).toHaveProperty('id');
    expect(result.name).toEqual(updateBrandDto.name);
    expect(result.code).toEqual(updateBrandDto.code);
  });

  it('should throw an error if the brand does not exist', async () => {
    BrandRepositoryMock.findOneBy.mockResolvedValue(null);
    await expect(
      service.update(999, { name: 'Test Brand Updated' }, 1),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if the brand is not found', async () => {
    BrandRepositoryMock.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should throw an error if the brand is not found', async () => {
    BrandRepositoryMock.findOneBy.mockResolvedValue(null);
    await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
  });
});
