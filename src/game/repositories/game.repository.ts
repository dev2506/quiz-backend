import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Game as GameSchema, GameDocument } from "../schemas/game.schema";
import { Model } from "mongoose";
import { Game, PlayerState } from "../models/game.model";
import { GameMapper } from "src/mappers/game.mapper";

@Injectable()
export class GameRepository {
    constructor(
        @InjectModel(GameSchema.name) private gameModel: Model<GameDocument>
    ) {

    }
    async createGame(game: {
        players: string[]
        questions: string[]
        status: string
        playerStates: Record<string, PlayerState>
    }) {
        const newGame = new this.gameModel(game)
        const newGameCreated = await newGame.save()
        return GameMapper.toDomain(newGameCreated)
    }
}