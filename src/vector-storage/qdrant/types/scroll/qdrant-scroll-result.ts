import { QdrantPoint } from '../search/qdrant-point';

export class QdrantScrollResult {
  points: QdrantPoint[];
  next_page_offset: string;
}
