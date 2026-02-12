import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly jwtService : JwtService) {}

    private users: { id: string, email: string, passwordHash: string }[] = [];

    async register( dto : RegisterDto ){
        const exsists = this.users.find((u) => u.email === dto.email);
        if(exsists) throw new ConflictException('Email already exsists');

        const passwordHash = await bcrypt.hash(dto.password, 10)

        const user = { id: crypto.randomUUID(), email: dto.email, passwordHash: passwordHash };
        this.users.push(user);

        const access_token = await this.signToken(user.id, user.email);
        
        return {
            message: 'Successfully Registered',
            access_token,
            user: { id: user.id, email: user.email }
        }
    }
    async login( dto : LoginDto ){
        const user = this.users.find((u) => u.email === dto.email)
        if(!user) throw new UnauthorizedException('Invalid Email or Password');

        const ok = await bcrypt.compare(dto.password, user.passwordHash)
        if(!ok) throw new UnauthorizedException('Invalid Email or Password');

        const access_token = await this.signToken(user.id, user.email);


        return {
            message: 'You are logged in',
            access_token,
            user: { id: user.id, email: user.email }
        }
    }
    private signToken(userId: string, email: string) {
        return this.jwtService.signAsync({ sub: userId, email });
    }
}