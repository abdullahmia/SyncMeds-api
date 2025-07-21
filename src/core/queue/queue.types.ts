export enum EmailJobType {
  ResetPassword = "reset-password",
  WelcomeEmail = "welcome-email",
  OrderConfirmation = "order-confirmation",
}

export interface EmailJobData {
  type: EmailJobType;
  payload: {
    email: string;
    [key: string]: any;
  };
}
