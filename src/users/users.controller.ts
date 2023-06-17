import {
    Body, Controller, Delete, Get, Param, Patch, Post, Query,
    NotFoundException, BadRequestException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dto/user.dto';
import { Class } from 'src/custom.types';


//pushed our custom interceptor for filtering props on response!
@Serialize(UserDto)
@Controller('/auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    //controller utility modified method
    httpError(user: User, instance: Class, msg: string) {
        return user ? user : (() => { throw new instance(msg); })();
    };

    @Post('/signup')
    async createUser(@Body() { email, password }: CreateUserDto) {
        const user = await this.authService.signUp(email, password);
        return this.httpError(user, BadRequestException, 'Email already in use!😔');
    };

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        return this.httpError(user, NotFoundException, `User not found with an id of ${id}`);
    };

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    };

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        const user = await this.usersService.remove(parseInt(id));
        return this.httpError(user, NotFoundException, `User not found with an id of ${id}`);
    };

    @Patch("/:id")
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const user = await this.usersService.update(parseInt(id), body);
        return this.httpError(user, NotFoundException, `User not found with an id of ${id}`);
    };
};
