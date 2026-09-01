import { QdrantPayload } from './qdrant-payload';

export class QdrantResult {
  id: string;
  version: number;
  score: number;
  payload: QdrantPayload;
}
