import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { env } from "src/config/env";
@Module({
    imports: [MongooseModule.forRoot(env.MONGO_URL, {
        dbName: env.MONGO_DB_NAME
    })],
})
export class DatabaseModule {

}