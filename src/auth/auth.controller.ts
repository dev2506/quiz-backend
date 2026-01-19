import { Controller, Post } from "@nestjs/common";
import { LOGIN_URL, REGISTER_URL } from "src/routes/routes";
import { RegisterUserDto } from "./dto/register-user.dto";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService
    ) {

    }
    @Post(REGISTER_URL)
    async registerUser(registerUserDto: RegisterUserDto) {
        this.authService.registerUser(registerUserDto)
    }

    @Post(LOGIN_URL)
    async loginUser() {

    }
}