import { CreatePostDto } from '../dtos/create-post.dto';
import { Injectable } from '@nestjs/common';
import { MetaOptionsService } from './../../meta-options/meta-options.service';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    let post = this.postsRepository.create({
      ...createPostDto,
    });

    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    let posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
      },
    });

    return posts;
  }

  public async delete(id: number) {
    let post = await this.postsRepository.findOneBy({ id });

    let inversePost = await this.metaOptionsRepository.find({
      where: { id: post.metaOptions.id },
      relations: {
        post: true,
      },
    });

    console.log(inversePost);

    return { deleted: true, id: post.id };
  }
}