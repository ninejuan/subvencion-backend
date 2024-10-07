import mongo from 'mongoose';
declare const _default: mongo.Model<{
    google_mail: string;
    name: string;
    google_uid: string;
    description: string;
    associated: string;
    profilePhoto: string;
    refreshToken: string;
}, {}, {}, {}, mongo.Document<unknown, {}, {
    google_mail: string;
    name: string;
    google_uid: string;
    description: string;
    associated: string;
    profilePhoto: string;
    refreshToken: string;
}> & {
    google_mail: string;
    name: string;
    google_uid: string;
    description: string;
    associated: string;
    profilePhoto: string;
    refreshToken: string;
} & {
    _id: mongo.Types.ObjectId;
}, mongo.Schema<any, mongo.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongo.DefaultSchemaOptions, {
    google_mail: string;
    name: string;
    google_uid: string;
    description: string;
    associated: string;
    profilePhoto: string;
    refreshToken: string;
}, mongo.Document<unknown, {}, mongo.FlatRecord<{
    google_mail: string;
    name: string;
    google_uid: string;
    description: string;
    associated: string;
    profilePhoto: string;
    refreshToken: string;
}>> & mongo.FlatRecord<{
    google_mail: string;
    name: string;
    google_uid: string;
    description: string;
    associated: string;
    profilePhoto: string;
    refreshToken: string;
}> & {
    _id: mongo.Types.ObjectId;
}>>;
export default _default;
