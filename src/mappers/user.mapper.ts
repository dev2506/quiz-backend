import { Model } from "mongoose";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import { User } from "src/users/models/user.model";
import { UserDocument } from "src/users/schemas/user.schema";

export class UserMapper {
    public static toDomain(userDoc: UserDocument): User {
        const doc = userDoc.toObject();
        return new User(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.password,
            doc.createdAt,
            doc.updatedAt,
        );
    }

    public static toDomainOptional(userDoc: UserDocument | null): User | null {
        return userDoc ? this.toDomain(userDoc) : null
    }
    public static toLoginUserDto(user: User): LoginUserDto {
        return {
            email: user.email,
            password: user.password,
        }
    }
}