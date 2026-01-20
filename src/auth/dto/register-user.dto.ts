import { IsEmail, IsString, MinLength } from "class-validator"
import { PASSWORD_MIN_LENGTH } from "src/constants/constants"

export class RegisterUserDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(PASSWORD_MIN_LENGTH)
    password: string

    @IsString()
    @MinLength(2)
    name: string
}