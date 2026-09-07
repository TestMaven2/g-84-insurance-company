import { QdrantScrollData } from './qdrant-scroll-data';

export class QdrantScrollResponse {
  status: number;
  statusText: string;
  data: QdrantScrollData;
}
