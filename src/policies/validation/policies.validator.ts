import { Injectable } from '@nestjs/common';
import { PolicySaveDto } from '../dto/policy.save-dto';
import { InsuranceType } from '../enums/insurance-type.enum';

@Injectable()
export class PoliciesValidator {
  validateSaveDto(saveDto: PolicySaveDto): void {
    if (!saveDto) {
      throw Error();
    }

    const type: InsuranceType = saveDto.type;
    if (!type) {
      throw Error();
    }

    const holderId: number = saveDto.holderId;
    if (!holderId || holderId < 1) {
      throw Error();
    }

    const agentId: number = saveDto.agentId;
    if (!agentId || agentId < 1) {
      throw Error();
    }

    const coverage: number = saveDto.coverage;
    if (
      !coverage ||
      (type === InsuranceType.LIABILITY && coverage < 1000) ||
      (type === InsuranceType.CASCO && coverage < 1500)
    ) {
      throw Error();
    }

    const issuedAt: Date = saveDto.issuedAt;
    if (!issuedAt || issuedAt.getTime() > Date.now()) {
      throw Error();
    }

    const expiresAt: Date = saveDto.expiresAt;
    if (
      !expiresAt ||
      expiresAt.getFullYear() - new Date().getFullYear() > 5 ||
      expiresAt.getTime() <= issuedAt.getTime()
    ) {
      throw Error();
    }
  }
}
