import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { DocumentService, DocumentUpdateInput } from './document.service';
import { Document } from './models/document.model';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @Query(() => [Document], { name: 'documents' })
  document(@Args('userId') userId: number) {
    return this.documentService.findByUserID(userId);
  }

  @Mutation(() => Document)
  async saveDocument(
    @Args('saveDocumentData') saveDocumentData: DocumentUpdateInput,
  ) {
    return this.documentService.saveDocument(saveDocumentData);
  }
}
