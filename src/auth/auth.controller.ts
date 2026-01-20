import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { LOGIN_URL, REGISTER_URL } from "src/constants/routes";
import { RegisterUserDto } from "./dto/register-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LoginUserDto } from "./dto/login-user.dto";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService
    ) {

    }
    @Post(REGISTER_URL)
    @HttpCode(HttpStatus.CREATED)
    async registerUser(@Body(ValidationPipe) registerUserDto: RegisterUserDto) {
        return this.authService.registerUser(registerUserDto)
    }

    @Post(LOGIN_URL)
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    async loginUser(@Body(ValidationPipe) loginUserDto: LoginUserDto, @CurrentUser() user: any) {
        return this.authService.loginUser(loginUserDto, user)
    }
}