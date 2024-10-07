"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.default.Schema({
    google_mail: { type: String, required: true },
    google_uid: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: " " },
    associated: { type: String, default: "무소속" },
    profilePhoto: { type: String, default: "default.png" },
    refreshToken: { type: String, default: "" },
});
exports.default = mongoose_1.default.model('user_data', userSchema);
//# sourceMappingURL=user.schema.js.map