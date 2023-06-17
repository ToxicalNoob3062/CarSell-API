import {
    Body, Controller, Delete, Get, Param, Patch, Post, Query,
    NotFoundException, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from 'src/users/dto/user.dto';


//pushed our custom interceptor for filtering props on response!
@Serialize(UserDto)
@Controller('/auth')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) { }

    //controller utility modified method
    http404(user: User, id: string) {
        return user ? user : (() => { throw new NotFoundException(`Could not find an user with an id of ${id}!`); })();
    };

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
    };


    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.usersService.findOne(parseInt(id));
        return this.http404(user, id);
    };

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    };

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        const user = await this.usersService.remove(parseInt(id));
        return this.http404(user, id);
    };

    @Patch("/:id")
    async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const user = await this.usersService.update(parseInt(id), body);
        return this.http404(user, id);
    };
};
