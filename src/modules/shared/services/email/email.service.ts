import config from "@/config";
import { compileTemplate } from "@/shared/utils/template.util";
import {
  EmailProvider,
  NodemailerProvider,
} from "./providers/nodemailer.provider";

type EmailOptions = {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
};

export class EmailService {
  constructor(private provider: EmailProvider) {}

  async send(options: EmailOptions): Promise<void> {
    const html = await compileTemplate(options.template, options.context);

    await this.provider.sendMail({
      from: `"${config.email.from}" <${config.email.from}>`,
      to: options.to,
      subject: options.subject,
      html,
    });
  }
}

// Singleton instance
export const emailService = new EmailService(new NodemailerProvider());
