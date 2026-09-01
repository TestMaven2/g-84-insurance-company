import { QdrantData } from './qdrant-data';

export class QdrantResponse {
  status: number;
  statusText: string;
  data: QdrantData;
}
