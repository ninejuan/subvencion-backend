import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session'
import * as passport from 'passport'
import { linkToDatabase } from './utils/db.util';
import { setupSwagger } from './utils/swagger.util';
import helmet from 'helmet';
import { config } from 'dotenv';

config(); const env = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
    exposedHeaders: ["Authorization"]
  });

  app.use(helmet({
    contentSecurityPolicy: false
  }));

  app.use(session({
    secret: env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000,
    }
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  await linkToDatabase();
  if (env.MODE == "DEV") {
    try {
      setupSwagger(app);
      console.log("Swagger is enabled");
    } catch (e) {
      console.error(e);
    }
  }
  await app.listen(process.env.PORT || 3000).then(() => {
    console.log(`App is running on Port ${env.PORT || 3000}`)
  }).catch((e) => {
    console.error(e)
  });
}
bootstrap();
