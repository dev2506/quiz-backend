import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { env } from "src/config/env";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: env.JWT_SECRET,
            signOptions: {
                expiresIn: env.JWT_EXPIRY
            },
            verifyOptions: {
                ignoreExpiration: false
            }
        }),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {

}