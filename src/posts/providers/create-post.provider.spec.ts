import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePostProvider } from './create-post.provider';
import { Post } from '../post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { ConflictException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const usersServiceMock = {
  findOneById: jest.fn(),
};

const tagsServiceMock = {
  findMultipleTags: jest.fn(),
};

describe('CreatePostProvider', () => {
  let provider: CreatePostProvider;
  let postsRepository: MockRepository;

  const post = {
    title: 'What new with NestJS',
    postType: postType.POST,
    slug: '4new1234asdasdassmmdnesssw',
    status: postStatus.DRAFT,
    content: 'test content',
    schema: '{\r\n \"@context\": \"https:\/\/schema.org\",\r\n \"@type\": \"Person\"\r\n }',
    featuredImageUrl: 'http://localhost.com/images/image1.jpg',
    publishOn: new Date('2024-12-16T07:46:32+0000'),
    metaOptions: {
      "metaValue": "{\"sidebarEnabled\": true, \"footerActive\":true}"
    },
    tags: [1, 3]
  };

  const user = {
    firstName: 'mark',
    lastName: 'mark',
    email: 'mark@doe.com',
    password: 'Password123#',
  };

  const mockTags = [
    { id: 1, name: 'javascript', slug: 'javascript', description: 'All posts javascript' },
    { id: 3, name: 'c--', slug: 'ccc', description: 'All posts c#' },
  ]; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostProvider,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: TagsService, useValue: tagsServiceMock },
        { provide: getRepositoryToken(Post), useValue: createMockRepository() },
      ],
    }).compile();

    provider = module.get<CreatePostProvider>(CreatePostProvider);
    postsRepository = module.get(getRepositoryToken(Post));
  });

  it('Should Be Defined', () => {
    expect(provider).toBeDefined();
  });

  describe('create', () => {
    describe('When Post Does Not Exist', () => {
      it('Should create a new post', async () => {
        postsRepository.findOne.mockResolvedValue(null);
        postsRepository.create.mockReturnValue(post);
        postsRepository.save.mockResolvedValue(post);
        usersServiceMock.findOneById.mockResolvedValue(user);
        tagsServiceMock.findMultipleTags.mockResolvedValue(mockTags); 

        const newPost = await provider.create(post, { sub: 1, email: 'mark@doe.com' });

        expect(postsRepository.create).toHaveBeenCalledWith({
          ...post,
          author: user,
          tags: mockTags
        });
        expect(postsRepository.save).toHaveBeenCalledWith(post);
        expect(usersServiceMock.findOneById).toHaveBeenCalledWith(1);
        expect(tagsServiceMock.findMultipleTags).toHaveBeenCalledWith(post.tags);
      });
    });
    describe('When Post Does Exist', () => {
      it('Should throw a conflict exeption', async () => {
        postsRepository.findOne.mockResolvedValue(null);
        postsRepository.create.mockReturnValue(post);
        postsRepository.save.mockRejectedValue('Our error');
        usersServiceMock.findOneById.mockResolvedValue(user);
        tagsServiceMock.findMultipleTags.mockResolvedValue(mockTags); 

        expect(provider.create(post, { sub: 1, email: 'mark@doe.com' })).rejects.toThrow(ConflictException);
      });
    });
  });
});