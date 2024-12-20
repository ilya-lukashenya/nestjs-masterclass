import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from 'src/tags/providers/tags.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { TagsController } from './tags.controller';
import { create } from 'node:domain';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const tagsServiceMock = {
    create: jest.fn(),
    delete: jest.fn(),
    findMultipleTags: jest.fn(),
    softRemove: jest.fn()
};


describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  const tag = {
    name: "dotnet",
    slug: "dotnet",
    description: "All posts dotnet",
    schema: '{\r\n \"@context\": \"https:\/\/schema.org\",\r\n \"@type\": \"Person\"\r\n }',
    featuredImage:'http://localhost.com/images/image1.jpg',
  };

  const tagNumber = 3;

  const mockTags = [
    { id: 1, name: 'javascript', slug: 'javascript', description: 'All posts javascript' },
    { id: 3, name: 'c--', slug: 'ccc', description: 'All posts c#' },
  ]; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [TagsController],
        providers: [
            { provide: TagsService, useValue: tagsServiceMock},
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('Should Be Defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    describe('When Tag Does Not Exist', () => {
      it('Should create a new tag', async () => {
        tagsServiceMock.create.mockResolvedValue(tag);

        await controller.create(tag);

        expect(tagsServiceMock.create).toHaveBeenCalledWith(tag);
      });
    });
  });

  describe('delete', () => {
    describe('When Tags Exist', () => {
      it('Should delete tag', async () => {
        tagsServiceMock.delete.mockReturnValue(tagNumber);

        await controller.delete(tagNumber);

        expect(tagsServiceMock.delete).toHaveBeenCalledWith(tagNumber);
      });
    });
  });

  describe('softDelete', () => {
    describe('When Tags Exist', () => {
      it('Should soft delete tag', async () => {
        tagsServiceMock.softRemove.mockReturnValue(tagNumber);

        await controller.softDelete(tagNumber);

        expect(tagsServiceMock.softRemove).toHaveBeenCalledWith(tagNumber);
      });
    });
  });
});