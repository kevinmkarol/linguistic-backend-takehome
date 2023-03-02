import { Field, ObjectType } from '@nestjs/graphql';

import type { Document as DocumentModel } from '@prisma/client';

import { User } from '../../user/models/user.model';

@ObjectType()
export class Document implements DocumentModel {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  author: User;

  @Field()
  authorId: number;

  @Field()
  creation_date: Date;

  @Field()
  last_update_date: Date;
}
