import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly confirmationCodesService: ConfirmationCodesService,
    private readonly configService: ConfigService,
  ) {}

  async sendConfirmationEmail(user: User): Promise<void> {
    const codeValue: string =
      await this.confirmationCodesService.generateConfirmationCode(user);

    const link: string = this.buildConfirmationLink(codeValue);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your registration',
      text: `To confirm your registration click the link - ${link}`,
    });
  }

  private buildConfirmationLink(codeValue: string): string {
    const host: string = this.configService.getOrThrow('SERVER_HOST');
    const port: string = this.configService.getOrThrow('SERVER_PORT');

    return `http://${host}:${port}/users/confirm/${codeValue}`;
  }
}
