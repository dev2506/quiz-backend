import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "src/users/schema/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {

    }
    async registerUser(registerUserDto: RegisterUserDto) {
        //TODO: move salt to env
        const user = await this.userService.createUser(registerUserDto)
        
        await this.loginUser(user)
    }

    //TODO: type of user?
    async loginUser(user: LoginUserDto) {
        const payload = {
            email: user.email,
        }
        const accessToken = this.jwtService.sign(payload)
        const {password: _, ...result} = user
        return {
            accessToken,
            result
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email)
        if (user) {
            const isValid = await this.userService.validatePassword(password, user.password)
            if (isValid) {
                return {
                    email: user.email,
                    id: user._id
                }
            }
        }
        throw new UnauthorizedException("Invalid credentials!")
    }
}