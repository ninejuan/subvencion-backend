"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkToDatabase = linkToDatabase;
const mongoose_1 = require("mongoose");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function linkToDatabase() {
    let murl;
    let env = process.env;
    murl = `${env.DB_TYPE}://${env.DB_ID}:${env.DB_PW}@${env.DB_CLUSTER}.${env.DB_CODE}.mongodb.net/${env.DB_FOLDER}`;
    console.log('murl', murl);
    mongoose_1.default.connect(`${murl}`).then(() => { console.log('mongoDB Connected'); }).catch((e) => {
        console.error(e);
    });
}
//# sourceMappingURL=db.util.js.map