import { UUID } from 'node:crypto';

export class QdrantPoint {
  id: UUID;
  vector: number[];
  payload: object;
}
