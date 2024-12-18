import { Test, TestingModule } from '@nestjs/testing';

import { DataSource } from 'typeorm';
import { create } from 'domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePostProvider } from './create-post.provider';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Post } from '../post.entity';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { emit } from 'process';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const mockCreatePostsProvider: Partial<CreatePostProvider> = {
      create: (createPostDto: CreatePostDto, activeUserDto: ActiveUserData) =>
        Promise.resolve({
            id: 115,
            title: createPostDto.title,
            postType: createPostDto.postType,
            slug: createPostDto.slug,
            status: createPostDto.status,
            content: createPostDto.content,
            schema: createPostDto.schema,
            featuredImageUrl: createPostDto.featuredImageUrl,
            publishOn: createPostDto.publishOn,
            metaOptions : {
                id: 666,
                metaValue: "{\"sidebarEnabled\": true, \"footerActive\":true}",
                createDate: new Date('2024-12-16T07:46:32+0000'),
                updateDate: new Date('2024-12-16T07:46:32+0000'),
                post: null
            },
            tags: null,
            author: {
                id: 1, 
                firstName: 'mark', 
                lastName: 'mark',
                sub: activeUserDto.sub,
                email: activeUserDto.email
            }
        }
    ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(Post), useValue: {} },
        { provide: CreatePostProvider, useValue: mockCreatePostsProvider },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('Should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('Should call createUser on createUserProvider', async () => {
      let post = await service.create({
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
        tags: [1, 3],
      }, 
      {
        sub: 222,
        email: 'john@doe.com'
      });

      expect(post).toBeDefined();
    });
  });
});