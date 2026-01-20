import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs"
import { RegisterUserDto } from "src/auth/dto/register-user.dto";
import { UserRepository } from "./repositories/user.repository";
import { env } from "src/config/env";

@Injectable()
export class UsersService {
    constructor(
        private userRepository: UserRepository,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async validatePassword(password: string, storedPassword: string) {
        return bcrypt.compare(password, storedPassword)
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findByEmail(email)
        return user
    }

    async createUser(registerUserDto: RegisterUserDto) {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, env.SALT)
        return this.userRepository.create({
            email: registerUserDto.email,
            name: registerUserDto.name,
            password: hashedPassword
        })
    }
}