import { DataSource, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { BadRequestException } from '@nestjs/common';
import { CreatePostProvider } from './create-post.provider';
import { Post } from '../post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

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
    metaOptions : {
      "metaValue": "{\"sidebarEnabled\": true, \"footerActive\":true}"
    },
    tags: [1, 3]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePostProvider,
        { provide: DataSource, useValue: {} },
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

        const newPost = await provider.create(post, {sub: 1, email: 'john@doe.com'});

        expect(postsRepository.findOne).toHaveBeenCalledWith({
          where: { slug: post.slug },
        });
        expect(postsRepository.create).toHaveBeenCalledWith(post);
        expect(postsRepository.save).toHaveBeenCalledWith(post);
      });
    });
  });
});