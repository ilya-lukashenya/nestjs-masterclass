import { PatchPostDto } from './../dtos/patch-post.dto';
import { TagsService } from './../../tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { waitForDebugger } from 'inspector';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    let author = await this.usersService.findOneById(createPostDto.authorId);

    let tags = await this.tagsService.findMultipleTags(createPostDto.tags);

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });

    return posts;
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

    let post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    post.tags = tags;

    return await this.postsRepository.save(post);
  }
}