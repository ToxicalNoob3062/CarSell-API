import {
    Body, Controller, Delete, Get, Param, Patch, Post, Query,
    NotFoundException, BadRequestException, Session
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
    httpError(user: User, exception: Class, msg: string) {
        return user ? user : (() => { throw new exception(msg); })();
    };

    @Get('/retrieve')
    async retrieveUp(@Session() session: any) {
        const user = await this.usersService.findOne(session.userId);
        return this.httpError(user, NotFoundException, `Session not found!`);
    }

    @Post('/signup')
    async signUp(@Body() { email, password }: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(email, password);
        session.userId = user.id;
        return this.httpError(user, BadRequestException, 'Email already in use!😔');
    };

    @Post('/signin')
    async signIn(@Body() { email, password }: CreateUserDto, @Session() session: any) {
        let [user] = await this.usersService.find(email);
        if (this.httpError(user, NotFoundException, `User not found with an email of ${email}`)) {
            user = await this.authService.signIn(user, password);
            if (this.httpError(user, BadRequestException, 'OOPS! Password was wrong!👎')) {
                session.userId = user.id;
                return user;
            }
        }
    };

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

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
