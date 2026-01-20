import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

// TODO: add jwt secret
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: '',
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