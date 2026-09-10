import { Module } from '@nestjs/common';
import { VectorStorageService } from './vector-storage.service';
import { QdrantFilterBuilder } from './qdrant/qdrant-filter.builder';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { QdrantClient as OfficialQdrantClient } from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@langchain/qdrant';
// Вариант для Gemini
// import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

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
    // Вариант для Gemini
    // {
    //   provide: GoogleGenerativeAIEmbeddings,
    //   useFactory: (configService: ConfigService) => {
    //     return new GoogleGenerativeAIEmbeddings({
    //       apiKey: configService.getOrThrow('GOOGLE_API_KEY'),
    //       model: configService.getOrThrow('GOOGLE_EMBEDDING_MODEL'),
    //     });
    //   },
    //   inject: [ConfigService],
    // },
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
    // Вариант для Gemini
    // {
    //   provide: QdrantVectorStore,
    //   useFactory: (
    //     client: OfficialQdrantClient,
    //     embeddings: GoogleGenerativeAIEmbeddings,
    //     config: ConfigService,
    //   ) => {
    //     return new QdrantVectorStore(embeddings, {
    //       client,
    //       collectionName: config.getOrThrow('KNOWLEDGE_DB_COLLECTION_NAME'),
    //     });
    //   },
    //   inject: [
    //     OfficialQdrantClient,
    //     GoogleGenerativeAIEmbeddings,
    //     ConfigService,
    //   ],
    // },
  ],
  exports: [VectorStorageService, QdrantVectorStore, QdrantFilterBuilder],
})
export class VectorStorageModule {}
