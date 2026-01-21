import { Injectable, NotFoundException } from "@nestjs/common";
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

    async save(game: Game) {
        const gameDoc = await this.gameModel
        .findByIdAndUpdate(
          game.id,
          {
            status: game.status,
            playerStates: game.playerStates,
            winner: game.winner,
          },
          { new: true },
        ).exec();
        if (!gameDoc) {
            throw new NotFoundException('Game not found')
        }
        return GameMapper.toDomain(gameDoc)
    }

    async findByUserIdAndStatus(
        userId: string,
        statuses: string[],
    ): Promise<Game | null> {
        const gameDoc = await this.gameModel
            .findOne({
                players: userId,
                status: { $in: statuses },
            })
            .exec();
        return GameMapper.toDomainOptional(gameDoc)
    }

    async findById(gameId: string) {
        const gameDoc = await this.gameModel.findById(gameId).exec();
        return GameMapper.toDomainOptional(gameDoc)
    }
}