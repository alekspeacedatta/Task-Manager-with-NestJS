import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { StringValue } from 'ms';


@Module({
    imports: [
        PassportModule,
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
    providers: [ AuthService ],
})
export class AuthModule {};