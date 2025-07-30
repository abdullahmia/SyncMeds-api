import { saleService } from "@/modules/sale";
import { emailService } from "../email.service";

export class SaleEmailSender {
  async sendInvoiceToCustomer(saleId: string): Promise<void> {
    const invoice = await saleService.getSaleInvoice(saleId);

    await emailService.send({
      to: invoice.customerEmail,
      subject: `Thank you for your purchase! Invoice #${invoice.invoiceNumber}`,
      template: "sale/invoice-payment",
      context: invoice,
    });
  }
}

export const saleEmailSender = new SaleEmailSender();
