import {
  DatabaseLogger,
  DEFALUT_APP_NAME,
  USER_ACCESS_TOKEN,
} from '@app/common';
import { AppConfig } from '../app.config';

export const ProdConfig: AppConfig = {
  appName: process.env.APP_NAME ?? DEFALUT_APP_NAME,
  port: +process.env.PORT,
  cors: { origin: process.env.CORS_ORIGIN },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
  },

  database: {
    type: 'mysql',
    connectorPackage: 'mysql2',
    host: process.env.DATABASE_HOST, // 개발
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: DatabaseLogger.logLevelParser(process.env.DATABASE_LOG),
    entities: [`${__dirname}/../../../entity/**/*.entity{.ts,.js}`],
    migrationsTableName: 'migrations',

    maxQueryExecutionTime:
      +process.env.DATABASE_MAX_QUERY_EXECUTION_TIME ?? 10000, // 10초

    /* DB 가용성에 따라 변경 해야한다. */
    extra: {
      connectionLimit: +process.env.DATABASE_CONNECTION_LIMIT ?? 5,
    },
  },

  swagger: {
    apis: {
      info: {
        title: process.env.SWAGGER_APIS_TITLE ?? DEFALUT_APP_NAME,
        description: process.env.SWAGGER_APIS_DESCRIPTION ?? DEFALUT_APP_NAME,
        version: process.env.SWAGGER_APIS_VERSION,
      },
      securityConfig: {
        name: USER_ACCESS_TOKEN,
        securityOptions: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Access JWT',
          description: 'Enter Access Token',
          in: 'header',
        },
      },
    },
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: +process.env.SENTRY_TRACES_SAMPLE_RATE,
  },
  slack: {
    serverErrorAlert: {
      channelName: process.env.SLACK_CHANNEL_NAME_BY_SERVER_ERROR_ALERT,
      webHooklUrl: process.env.SLACK_WEB_HOOK_URI_BY_SERVER_ERROR_ALERT,
      description: process.env.SLACK_DESCRIPTION_BY_SERVER_ERROR_ALERT,
      viewerUrl: process.env.SLACK_VIEWER_URL_BY_SERVER_ERROR_ALERT,
    },
  },
};
