import { ConflictException, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    private users: { email: string, password: string }[] = [];

    register( dto : RegisterDto ){
        const exsists = this.users.find((u) => u.email === dto.email);
        if(exsists) throw new ConflictException('Email already exsists');

        const user = { email: dto.email, password: dto.password };
        this.users.push(user);
        return {
            message: 'Successfully Registered',
            user: { email: user.email }
        }
    }
    login( dto : LoginDto ){
        const matchs = this.users.find((u) => u.email === dto.email)
        if(!matchs) throw new ConflictException('You are not registered yet');
        return {
            message: 'You are logined brother',
            user: { email: dto.email }
        }
    }

}