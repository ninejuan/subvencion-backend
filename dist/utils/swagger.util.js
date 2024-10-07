"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_1 = require("@nestjs/swagger");
const env = process.env;
function setupSwagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle(`${env.NAME}`)
        .setDescription(`${env.DESC}`)
        .setVersion(`${env.VER}`)
        .addTag(`${env.TAG}`)
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    console.log(`${env.SWAGGER_URI}`);
    swagger_1.SwaggerModule.setup(`${env.SWAGGER_URI}`, app, document);
}
//# sourceMappingURL=swagger.util.js.map