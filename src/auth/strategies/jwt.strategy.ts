import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "src/config/env";

// TODO: add jwt secret
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET,
            ignoreExpiration: false
        })
    }

    async validate(payload: any) {
        return {
            email: payload.email,
            id: payload.id
        }
    }
}