import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { env } from "src/config/env";
@Module({
    //TODO: Move mongo db url to env
    imports: [MongooseModule.forRoot(env.MONGO_URL)],
})
export class DatabaseModule {

}