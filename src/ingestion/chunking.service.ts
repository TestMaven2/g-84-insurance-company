import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationException } from '../exceptions/types/configuration.exception';

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

  chunkBySizeWithOverlap(text: string): string[] {
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
