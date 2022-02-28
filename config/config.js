require("dotenv").config();

module.exports = {
  test: {
    server: {
      protocol: process.env.PROTOCAL || "http",
      port: process.env.PORT || 3000,
      hostname: process.env.HOST || "localhost",
      host_root_path: process.env.HOST + "/chefk-frontend/#",
    },

    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root@123",
    database: process.env.DB_NAME || "CMS",
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    logging: process.env.DB_LOGGING == "true" || false,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND || 12,
    jwt: {
      access_token: process.env.JWT_ACCESS_TOKEN || "yourAccessToken",
      login_expires_in: process.env.JWT_LOGIN_EXPIRES_IN || "45m",
      reset_password_expires_in:
        process.env.JWT_RESET_PASSWORD_EXPIRES_IN || "45m",
    },
    generate_password_path: process.env.GENERATE_PASSWORD_PATH,
    reset_password_path: process.env.RESET_PASSWORD_PATH,
    checkout_path: process.env.CHECKOUT_PATH,
    file_upload_location: process.env.FILE_UPLOAD_LOCATION || "./uploads/files",
    sendgrid: {
      api_key: process.env.SENDGRID_API_KEY,
      from_email: process.env.SENDGRID_FROM_EMAIL,
      generate_password_template_id:
      process.env.SENDGRID_GENERATE_PASSWORD_TEMPLATE_ID,
      reset_password_template_id:
        process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
      class_invitation_template_id:
        process.env.SENDGRID_CLASS_INVITATION_TEMPLATE_ID,
      payment_request_template_id:
        process.env.SENDGRID_PAYMENT_REQUEST_TEMPLATE_ID,
      general_template_id: process.env.SENDGRID_GENERAL_TEMPLATE_ID,
    },
    stripe: {
      api_key: process.env.STRIPE_API_KEY,
      currency: process.env.STRIPE_CURRENCY || "USD",
    },
  },

  development: {
    server: {
      protocol: process.env.PROTOCAL || "http",
      port: process.env.PORT || 3001,
      hostname: process.env.HOST,
      host_root_path: process.env.HOST + "/chefk-frontend/#",
    },
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    logging: process.env.DB_LOGGING == "true" || false,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND || 12,
    jwt: {
      access_token: process.env.JWT_ACCESS_TOKEN,
      login_expires_in: process.env.JWT_LOGIN_EXPIRES_IN,
      reset_password_expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    },
    generate_password_path: process.env.GENERATE_PASSWORD_PATH,
    reset_password_path: process.env.RESET_PASSWORD_PATH,
    checkout_path: process.env.CHECKOUT_PATH,
    file_upload_location: process.env.FILE_UPLOAD_LOCATION || "./uploads/files",
    sendgrid: {
      api_key: process.env.SENDGRID_API_KEY,
      from_email: process.env.SENDGRID_FROM_EMAIL,
      generate_password_template_id:
      process.env.SENDGRID_GENERATE_PASSWORD_TEMPLATE_ID,
      reset_password_template_id:
        process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
      class_invitation_template_id:
        process.env.SENDGRID_CLASS_INVITATION_TEMPLATE_ID,
      payment_request_template_id:
        process.env.SENDGRID_PAYMENT_REQUEST_TEMPLATE_ID,
      general_template_id: process.env.SENDGRID_GENERAL_TEMPLATE_ID,
    },
    stripe: {
      api_key: process.env.STRIPE_API_KEY,
      currency: process.env.STRIPE_CURRENCY || "USD",
    },
  },

  stage: {
    server: {
      protocol: process.env.PROTOCAL || "https",
      port: process.env.PORT || 3002,
      hostname: process.env.HOST,
      host_root_path: process.env.HOST + "/#",
    },
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    logging: process.env.DB_LOGGING == "true" || false,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND || 12,
    jwt: {
      access_token: process.env.JWT_ACCESS_TOKEN,
      login_expires_in: process.env.JWT_LOGIN_EXPIRES_IN,
      reset_password_expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    },
    generate_password_path: process.env.GENERATE_PASSWORD_PATH,
    reset_password_path: process.env.RESET_PASSWORD_PATH,
    checkout_path: process.env.CHECKOUT_PATH,
    file_upload_location: process.env.FILE_UPLOAD_LOCATION || "./uploads/files",
    sendgrid: {
      api_key: process.env.SENDGRID_API_KEY,
      from_email: process.env.SENDGRID_FROM_EMAIL,
      generate_password_template_id:
      process.env.SENDGRID_GENERATE_PASSWORD_TEMPLATE_ID,
      reset_password_template_id:
        process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
      class_invitation_template_id:
        process.env.SENDGRID_CLASS_INVITATION_TEMPLATE_ID,
      payment_request_template_id:
        process.env.SENDGRID_PAYMENT_REQUEST_TEMPLATE_ID,
      general_template_id: process.env.SENDGRID_GENERAL_TEMPLATE_ID,
    },
    stripe: {
      api_key: process.env.STRIPE_API_KEY,
      currency: process.env.STRIPE_CURRENCY || "USD",
    },
  },

  prod: {
    server: {
      protocol: process.env.PROTOCAL || "https",
      port: process.env.PORT,
      hostname: process.env.HOST,
      host_root_path: process.env.HOST + "/#",
    },
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    logging: process.env.DB_LOGGING == "true" || false,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND || 12,
    jwt: {
      access_token: process.env.JWT_ACCESS_TOKEN,
      login_expires_in: process.env.JWT_LOGIN_EXPIRES_IN,
      reset_password_expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN,
    },
    generate_password_path: process.env.GENERATE_PASSWORD_PATH,
    reset_password_path: process.env.RESET_PASSWORD_PATH,
    checkout_path: process.env.CHECKOUT_PATH,
    file_upload_location: process.env.FILE_UPLOAD_LOCATION || "./uploads/files",
    sendgrid: {
      api_key: process.env.SENDGRID_API_KEY,
      from_email: process.env.SENDGRID_FROM_EMAIL,
      generate_password_template_id:
      process.env.SENDGRID_GENERATE_PASSWORD_TEMPLATE_ID,
      reset_password_template_id:
        process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
      class_invitation_template_id:
        process.env.SENDGRID_CLASS_INVITATION_TEMPLATE_ID,
      payment_request_template_id:
        process.env.SENDGRID_PAYMENT_REQUEST_TEMPLATE_ID,
      general_template_id: process.env.SENDGRID_GENERAL_TEMPLATE_ID,
    },
    stripe: {
      api_key: process.env.STRIPE_API_KEY,
      currency: process.env.STRIPE_CURRENCY || "USD",
    },
  },
};
