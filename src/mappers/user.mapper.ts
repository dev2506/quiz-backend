import { Model } from "mongoose";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { User } from "src/users/schema/user.schema";

export class UserMapper {
    static toLoginUserDto(user: any): LoginUserDto {
        return {
            email: user.email,
            password: user.password,
        }
    }
}