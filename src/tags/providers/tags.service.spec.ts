import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from '../tag.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});


describe('TagService', () => {
  let service: TagsService;
  let tagsRepository: MockRepository;

  const tag = {
    name: "dotnet",
    slug: "dotnet",
    description: "All posts dotnet",
    schema: '{\r\n \"@context\": \"https:\/\/schema.org\",\r\n \"@type\": \"Person\"\r\n }',
    featuredImage:'http://localhost.com/images/image1.jpg',
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getRepositoryToken(Tag), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagsRepository = module.get(getRepositoryToken(Tag));
  });

  it('Should Be Defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    describe('When Tag Does Not Exist', () => {
      it('Should create a new tag', async () => {
        tagsRepository.create.mockReturnValue(tag);
        tagsRepository.save.mockResolvedValue(tag);

        const newPost = await service.create(tag);

        expect(tagsRepository.create).toHaveBeenCalledWith(tag);
        expect(tagsRepository.save).toHaveBeenCalledWith(tag);
      });
    });
  });
});