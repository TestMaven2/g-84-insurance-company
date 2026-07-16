import { Injectable } from '@nestjs/common';
import { UserSaveDto } from '../dto/user.save-dto';
import { UserUpdateDto } from '../dto/user.update-dto';

@Injectable()
export class UsersValidator {
  validateSaveDto(saveDto: UserSaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const email: string = saveDto.email.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw Error();
    }

    const password: string = saveDto.password.trim();
    if (!password || password.length < 8 || password.length > 20) {
      throw Error();
    }

    const name: string = saveDto.name.trim();
    if (!name || name.length < 2 || name.length > 30) {
      throw Error();
    }
  }

  validateUpdateDto(updateDto: UserUpdateDto): void {
    if (!updateDto) {
      throw Error();
    }

    const name: string = updateDto.newName.trim();
    if (!name || name.length < 2 || name.length > 30) {
      throw Error();
    }
  }
}
