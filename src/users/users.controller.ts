import {
    Body, Controller, Delete, Get, Param, Patch, Post, Query,
    NotFoundException, BadRequestException, Session, UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { httpError } from 'src/extras/utility.functions';



//pushed our custom interceptor for filtering props on response!

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) { }

    @UseGuards(AuthGuard)
    @Get('/retrieve')
    retrieveUp(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async signUp(@Body() { email, password }: CreateUserDto, @Session() session: any) {
        let user = await this.authService.signUp(email, password);
        user = httpError(user, BadRequestException, 'Email already in use!😔');
        session.userId = user.id;
        return user;
    };

    @Post('/signin')
    async signIn(@Body() { email, password }: CreateUserDto, @Session() session: any) {
        let user = await this.usersService.findByMail(email);
        if (httpError(user, NotFoundException, `User not found with an email of ${email}`)) {
            user = await this.authService.signIn(user, password);
            if (httpError(user, BadRequestException, 'OOPS! Password was wrong!👎')) {
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
        const user = await this.usersService.findById(parseInt(id));
        return httpError(user, NotFoundException, `User not found with an id of ${id}`);
    };

    @Get()
    async findUserByMail(@Query('email') email: string) {
        return await this.usersService.findByMail(email);
    };

    @UseGuards(AuthGuard)
    @Delete()
    async deleteUser(@CurrentUser() user: User) {
        user = await this.usersService.remove(user);
        return httpError(user, BadRequestException, `Clear Published Reports Before Deleting Account!`);
    };

    @UseGuards(AuthGuard)
    @Patch()
    async updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto) {
        return await this.usersService.update(user, body);
    };
};
