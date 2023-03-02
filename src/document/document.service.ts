import { Injectable } from '@nestjs/common';
import { Field, InputType } from '@nestjs/graphql';

import { PrismaService } from '../prisma';

@InputType()
export class DocumentUpdateInput {
  @Field()
  title: string;

  @Field()
  text: string;

  @Field()
  userID: number;
}

@Injectable()
export class DocumentService {
  constructor(private readonly prismaService: PrismaService) {}

  findByUserID(userID: number) {
    return this.prismaService.document.findMany({
      where: {
        authorId: userID,
      },
    });
  }

  async saveDocument(saveDocumentData: DocumentUpdateInput) {
    // Determine if the document already exists
    const existingDocuments = await this.prismaService.document.findMany({
      where: {
        title: saveDocumentData.title,
        authorId: saveDocumentData.userID,
      },
    });
    if (existingDocuments.length) {
      // Update the last entry in the database to make deduplication/queries
      // more predictable in the event of migrations
      const final_entry = existingDocuments[existingDocuments.length - 1];
      return await this.prismaService.document.update({
        data: {
          body: saveDocumentData.text,
        },
        where: {
          id: final_entry.id,
        },
      });
    } else {
      return await this.prismaService.document.create({
        data: {
          title: saveDocumentData.title,
          body: saveDocumentData.text,
          authorId: saveDocumentData.userID,
          last_update_date: new Date(),
        },
      });
    }
  }
}
