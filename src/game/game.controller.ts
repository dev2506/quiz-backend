import { Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { GAME_START_URL } from "src/constants/routes";

@Controller()
export class GameController {
    constructor() {

    }
    @Post(GAME_START_URL)
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async startGame(@CurrentUser() user: any) {
        // TODO: if in active game, handle
        return {
            message: "Ready!"
        }
    }
}