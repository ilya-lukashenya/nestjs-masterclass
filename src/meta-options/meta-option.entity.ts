import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';

import { Post } from 'src/posts/post.entity';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @OneToOne(() => Post, (post) => post.metaOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Post;
}