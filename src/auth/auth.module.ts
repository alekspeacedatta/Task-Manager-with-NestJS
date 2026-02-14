import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { StringValue } from 'ms';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => ({
                    secret: config.get<string>('JWT_SECRET')!,
                    signOptions: {
                    expiresIn: (config.get<StringValue>('JWT_EXPIRES_IN') ?? '1h') as StringValue,
                },
            }),
        })
    ],
    controllers: [ AuthController ],
    providers: [ AuthService, JwtStrategy ],
})
export class AuthModule {};