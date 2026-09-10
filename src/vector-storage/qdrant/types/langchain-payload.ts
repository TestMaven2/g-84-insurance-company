import { Chunk } from '../../../ingestion/types/chunk';

export interface LangChainPayload {
  content: string;
  metadata: Omit<Chunk, 'text'>;
}
