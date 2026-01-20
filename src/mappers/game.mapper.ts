import { Game, GameWinner } from "src/game/models/game.model";
import { GameDocument } from "src/game/schemas/game.schema";

export class GameMapper {
    public static toDomain(gameDoc: GameDocument): Game {
        const doc = gameDoc.toObject()
        return new Game(
            doc._id.toString(),
            doc.players,
            doc.questions,
            doc.status as 'waiting' | 'active' | 'completed',
            doc.playerStates,
            doc.winner as GameWinner | null
        );
    }
    public static toDomainOptional(gameDoc: GameDocument | null): Game | null {
        return gameDoc ? this.toDomain(gameDoc) : null
    }
}