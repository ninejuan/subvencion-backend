import mongo from 'mongoose';

const userSchema = new mongo.Schema({
    google_mail: { type: String, required: true },
    google_uid: { type: String, required: true },
    name: { type: String, required: true },
    profilePhoto: { type: String, default: "default.png" }, // 저장된 파일명
    jacode: { type: Array<String>, default: [] },
    keywords: { type: Array<String>, default: [] }
});

export default mongo.model('user_data', userSchema);