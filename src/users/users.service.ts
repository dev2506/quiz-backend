import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs"
import { RegisterUserDto } from "src/auth/dto/register-user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async validatePassword(password: string, storedPassword: string) {
        const isValid = await bcrypt.compare(password, storedPassword)
        return isValid
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({email})
        return user
    }

    async createUser(registerUserDto: RegisterUserDto) {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10)
        const newUser = new this.userModel({
            email: registerUserDto.email,
            name: registerUserDto.name,
            password: hashedPassword,
        })

        const createdUser = await newUser.save().catch(err => {
            //TODO: if not unique, throw exception
            throw err
        })
        return createdUser
    }
}