import { UUID } from 'node:crypto';
import { Chunk } from '../../../../ingestion/types/chunk';

export class QdrantPoint {
  id: UUID;
  vector: number[];
  payload: Chunk;
}
