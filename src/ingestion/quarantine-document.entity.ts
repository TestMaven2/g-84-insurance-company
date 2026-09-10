import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quarantine_documents')
export class QuarantineDocument {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'document_id', unique: false, nullable: false })
  documentId: string;

  @Column({ name: 'text', unique: false, nullable: false })
  text: string;

  @Column({ name: 'reason', unique: false, nullable: false })
  reason: string;
}
