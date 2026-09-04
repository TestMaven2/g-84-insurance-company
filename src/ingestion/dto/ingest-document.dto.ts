import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class IngestDocumentDto {
  insuranceType: string;

  @Transform(({ value }: TransformFnParams): string[] =>
    Array.isArray(value) ? value : [value],
  )
  departments: string[];

  language: string;

  @Transform(({ value }: TransformFnParams): boolean | string => {
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return value;
  })
  @IsBoolean()
  publicAccess: boolean;
}
