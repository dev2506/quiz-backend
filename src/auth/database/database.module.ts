import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    //TODO: Move mongo db url to env
    imports: [MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class DatabaseModule {

}