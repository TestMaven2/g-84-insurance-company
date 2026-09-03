import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationException } from '../exceptions/types/configuration.exception';
import { Chunk } from './types/chunk';
import { IngestDocumentDto } from './dto/ingest-document.dto';

@Injectable()
export class ChunkingService {
  constructor(private readonly configService: ConfigService) {}

  chunkBySentences(text: string): string[] {
    return text.split(/(?<=[.!?])(?: |\r?\n)+/);
  }

  chunkByParagraphs(text: string): string[] {
    return text.split(/(?:\r?\n){2,}/);
  }

  chunkBySize(text: string): string[] {
    const chunkSize: number = this.getChunkSize();

    const result: string[] = [];
    const allWords: string[] = text.split(/\s+/);
    let start: number = 0;

    while (start < allWords.length) {
      const end: number = start + chunkSize;
      const chunk: string = allWords.slice(start, end).join(' ').trim();
      result.push(chunk);
      start = end;
    }

    return result;
  }

  chunkBySizeWithOverlap(
    texts: string[],
    fileName: string,
    ingestDocumentDto: IngestDocumentDto,
  ): Chunk[] {
    const chunks: Chunk[] = [];

    for (let i: number = 0; i < texts.length; i++) {
      const currentText: string = texts[i];

      if (currentText && currentText.trim() !== '') {
        const textParts: string[] =
          this.chunkOneTextBySizeWithOverlap(currentText);

        for (let j: number = 0; j < textParts.length; j++) {
          chunks.push(
            this.fillChunk(fileName, i + 1, textParts[j], ingestDocumentDto),
          );
        }
      }
    }

    return chunks;
  }

  private fillChunk(
    fileName: string,
    pageNumber: number,
    text: string,
    ingestDocumentDto: IngestDocumentDto,
  ): Chunk {
    const chunk: Chunk = new Chunk();
    chunk.docTitle = fileName;
    chunk.page = pageNumber;
    chunk.text = text;
    chunk.insuranceType = ingestDocumentDto.insuranceType;
    chunk.departments = ingestDocumentDto.departments;
    chunk.language = ingestDocumentDto.language;
    return chunk;
  }

  private chunkOneTextBySizeWithOverlap(text: string): string[] {
    const chunkSize: number = this.getChunkSize();
    const overlap: number = this.getOverlap(chunkSize);

    const result: string[] = [];
    const allWords: string[] = text.split(/\s+/);
    let start: number = 0;

    while (start < allWords.length) {
      const end: number = start + chunkSize;
      const chunk: string = allWords.slice(start, end).join(' ').trim();
      result.push(chunk);
      start = end - overlap;
    }

    return result;
  }

  private getChunkSize(): number {
    const chunkSize: number = Number(
      this.configService.getOrThrow('CHUNK_SIZE'),
    );

    if (chunkSize < 1) {
      throw new ConfigurationException(
        'CHUNK_SIZE should be greater than zero',
      );
    }

    return chunkSize;
  }

  private getOverlap(chunkSize: number): number {
    const overlap: number = Number(
      this.configService.getOrThrow('CHUNK_OVERLAP'),
    );

    if (overlap < 1) {
      throw new ConfigurationException(
        'CHUNK_OVERLAP should be greater than zero',
      );
    }

    if (overlap >= chunkSize) {
      throw new ConfigurationException(
        'CHUNK_OVERLAP should be less than CHUNK_SIZE',
      );
    }

    return overlap;
  }
}
