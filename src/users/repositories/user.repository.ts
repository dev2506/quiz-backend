import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User as UserSchema, UserDocument } from "../schemas/user.schema";
import { User } from "../models/user.model";
import { UserMapper } from "src/mappers/user.mapper";

export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
    ) {
        
    }
    // TODO: Error handling and global exception filter with proper response
    async create(userData: CreateUserData): Promise<User> {
        const newUser = new this.userModel(userData)
        const createdUser = await newUser.save()
        return UserMapper.toDomain(createdUser)
    }

    async findByEmail(email: string): Promise<User | null> {
        const userDoc = await this.userModel.findOne({ email }).exec();
        return UserMapper.toDomainOptional(userDoc)
    }
}