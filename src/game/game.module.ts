import { Module } from "@nestjs/common";
import { GameController } from "./game.controller";
import { GameService } from "./game.service";
import { GameGateway } from "./game.gateway";
import { MongooseModule } from "@nestjs/mongoose";
import { Game, GameSchema } from "./schemas/game.schema";
import { GameRepository } from "./repositories/game.repository";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { env } from "src/config/env";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Game.name, schema: GameSchema}]),
        JwtModule.register({
            secret: env.JWT_SECRET,
            signOptions: {
                expiresIn: env.JWT_EXPIRY
            },
            verifyOptions: {
                ignoreExpiration: false
            }
        })
    ],
    controllers: [GameController],
    providers: [GameService, GameGateway, GameRepository],
    exports: [GameService]
})
export class GameModule {

}