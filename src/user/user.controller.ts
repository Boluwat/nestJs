import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { loginUserDTO } from 'src/userDTO/loginUser.dto';
import { registerUserDTO } from 'src/userDTO/createUser.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async registerUser(
    @Body()
    user: registerUserDTO,
  ): Promise<User> {
    return this.userService.registerUser(user);
  }

  @Post('login')
  async loginUser(
    @Body()
    user: loginUserDTO,
  ): Promise<{ accessToken: string }> {
    return this.userService.loginUser(user);
  }

  @UseGuards(AuthGuard())
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
