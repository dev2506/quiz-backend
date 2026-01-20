import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User as UserSchema, UserDocument } from "src/users/schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "src/users/models/user.model";
import { UserMapper } from "src/mappers/user.mapper";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        @InjectModel(UserSchema.name) private userModel: Model<UserDocument>
    ) {

    }
    async registerUser(registerUserDto: RegisterUserDto) {
        const user = await this.userService.createUser(registerUserDto)
        const loginUserDto = UserMapper.toLoginUserDto(user)
        return this.loginUser(loginUserDto, user)
    }

    async loginUser(loginUserDto: LoginUserDto, user: any) {
        const payload = {
            email: loginUserDto.email,
            id: user.id
        }
        const accessToken = this.jwtService.sign(payload)
        const {password: _, ...result} = loginUserDto
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
                    id: user.id
                }
            }
        }
        throw new UnauthorizedException("Invalid credentials!")
    }
}