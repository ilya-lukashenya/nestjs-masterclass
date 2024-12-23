import { postStatus } from "./enums/postStatus.enum";
import { postType } from "./enums/postType.enum";
import { PostsController } from "./posts.controller";
import { PostsService } from "./providers/posts.service";
import { Test, TestingModule } from '@nestjs/testing';

const postsServiceMock = {
    create: jest.fn(),
    delete: jest.fn(),
    findMultipleTags: jest.fn(),
    softRemove: jest.fn()
};


describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

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
  
    const user = { sub: 1, email: 'mark@doe.com' };
  
  
    const mockTags = [
      { id: 1, name: 'javascript', slug: 'javascript', description: 'All posts javascript' },
      { id: 3, name: 'c--', slug: 'ccc', description: 'All posts c#' },
    ]; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [PostsController],
        providers: [
            { provide: PostsService, useValue: postsServiceMock},
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('Should Be Defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    describe('When Tag Does Not Exist', () => {
      it('Should create a new tag', async () => {
        postsServiceMock.create.mockResolvedValue(post);

        await controller.createPost(post, { sub: 1, email: 'mark@doe.com' })

        expect(postsServiceMock.create).toHaveBeenCalledWith(post, { sub: 1, email: 'mark@doe.com' });
      });
    });
  });

});