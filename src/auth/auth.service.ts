    import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
    import * as bcrypt from 'bcrypt';
    import { RegisterDto } from "./dto/register.dto";
    import { LoginDto } from "./dto/login.dto";
    import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";

    @Injectable()
    export class AuthService {
        constructor(
            private readonly jwtService : JwtService,
            @InjectRepository(User) private readonly usersRepo: Repository<User>
        ) {}

        async register( dto : RegisterDto ){
            const exsists = await this.usersRepo.findOne({ where: { email: dto.email } });
            if(exsists) throw new ConflictException('Email already exsists');

            const passwordHash = await bcrypt.hash(dto.password, 10)

            const user = this.usersRepo.create({ email: dto.email, passwordHash: passwordHash })
            const saved = await this.usersRepo.save(user);

            const access_token = await this.signToken(saved.id, saved.email);
            
            return {
                message: 'Successfully Registered',
                access_token,
                user: { id: saved.id, email: saved.email }
            }
        }
        async login( dto : LoginDto ){
            const user = await this.usersRepo.findOne({ where: { email: dto.email } })
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