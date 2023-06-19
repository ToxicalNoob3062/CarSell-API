import {
    Body, Controller, Delete, Get, Param, Patch, Post, Query,
    NotFoundException, BadRequestException, Session, UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Class } from 'src/custom.types';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';



//pushed our custom interceptor for filtering props on response!

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    //controller utility modified method
    httpError(user: User, exception: Class, msg: string) {
        return user ? user : (() => { throw new exception(msg); })();
    };

    @UseGuards(AuthGuard)
    @Get('/retrieve')
    retrieveUp(@CurrentUser() user: User) {
        return user;
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
    async findAllUsers(@Query('email') email: string) {
        return await this.usersService.find(email);
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
