import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        data: import("./auth.service").TokenPair;
    }>;
    login(dto: LoginDto): Promise<{
        data: import("./auth.service").TokenPair;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        data: import("./auth.service").TokenPair;
    }>;
    logout(dto: RefreshTokenDto): Promise<{
        message: string;
    }>;
}
