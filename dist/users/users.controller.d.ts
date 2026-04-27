import { UsersService } from './users.service';
declare class UpdateUserDto {
    fullName?: string;
    phoneNumber?: string;
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    directory(): Promise<{
        id: any;
        fullName: any;
        userName: any;
        email: any;
        role: any;
    }[]>;
    findOne(id: number): Promise<any>;
    update(id: number, dto: UpdateUserDto): Promise<any>;
}
export {};
