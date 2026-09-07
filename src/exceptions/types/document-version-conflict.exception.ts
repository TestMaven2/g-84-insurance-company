import { HttpException, HttpStatus } from '@nestjs/common';

export class DocumentVersionConflictException extends HttpException {
  constructor(oldVersion: number, newVersion: number) {
    super(
      `New document version ${newVersion} should be greater that the old version ${oldVersion}`,
      HttpStatus.CONFLICT,
    );
  }
}
