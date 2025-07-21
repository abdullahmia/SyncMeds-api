import config from "@/config";

type EmailConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
  tls?: {
    rejectUnauthorized: boolean;
  };
};

export const emailConfig: EmailConfig = {
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.secure,
  // secure: config.email.secure,
  // ...(config.env === "production"
  //   ? {
  //       auth: {
  //         user: config.email.user,
  //         pass: config.email.password,
  //       },
  //       tls: {
  //         rejectUnauthorized: true,
  //       },
  //     }
  //   : {
  //       tls: {
  //         rejectUnauthorized: false,
  //       },
  //     }),
};
