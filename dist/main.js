"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const passport = require("passport");
const db_util_1 = require("./utils/db.util");
const swagger_util_1 = require("./utils/swagger.util");
const helmet_1 = require("helmet");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const env = process.env;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix(process.env.GLOBAL_PREFIX);
    app.enableCors({
        origin: ['http://localhost:5173'],
        credentials: true,
        exposedHeaders: ["Authorization"]
    });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false
    }));
    app.use(session({
        secret: env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000,
        }
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    await (0, db_util_1.linkToDatabase)();
    if (env.MODE == "DEV") {
        try {
            (0, swagger_util_1.setupSwagger)(app);
            console.log("Swagger is enabled");
        }
        catch (e) {
            console.error(e);
        }
    }
    await app.listen(process.env.PORT || 3000).then(() => {
        console.log(`App is running on Port ${env.PORT || 3000}`);
    }).catch((e) => {
        console.error(e);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map