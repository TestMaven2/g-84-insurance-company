import { Transform, TransformFnParams } from 'class-transformer';

export class IngestDocumentDto {
  insuranceType: string;

  @Transform(({ value }: TransformFnParams): string[] =>
    Array.isArray(value) ? value : [value],
  )
  departments: string[];

  language: string;
}
