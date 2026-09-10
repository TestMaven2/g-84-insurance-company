import { Module } from '@nestjs/common';
import { VectorStorageService } from './vector-storage.service';
import { QdrantFilterBuilder } from './qdrant/qdrant-filter.builder';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { QdrantClient as OfficialQdrantClient } from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@langchain/qdrant';

@Module({
  providers: [
    VectorStorageService,
    QdrantFilterBuilder,
    {
      provide: OpenAIEmbeddings,
      useFactory: (configService: ConfigService) => {
        return new OpenAIEmbeddings({
          apiKey: configService.getOrThrow('OPENAI_API_KEY'),
          model: configService.getOrThrow('OPENAI_EMBEDDING_MODEL'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: OfficialQdrantClient,
      useFactory: (configService: ConfigService): OfficialQdrantClient => {
        return new OfficialQdrantClient({
          url: configService.getOrThrow('QDRANT_URL'),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: QdrantVectorStore,
      useFactory: (
        client: OfficialQdrantClient,
        embeddings: OpenAIEmbeddings,
        config: ConfigService,
      ) => {
        return new QdrantVectorStore(embeddings, {
          client,
          collectionName: config.getOrThrow('KNOWLEDGE_DB_COLLECTION_NAME'),
        });
      },
      inject: [OfficialQdrantClient, OpenAIEmbeddings, ConfigService],
    },
  ],
  exports: [VectorStorageService, QdrantVectorStore, QdrantFilterBuilder],
})
export class VectorStorageModule {}
