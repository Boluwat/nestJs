import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
// import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { registerUserDTO } from 'src/userDTO/createUser.dto';
import { loginUserDTO, loginUserResponseDTO } from 'src/userDTO/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { hashManager } from 'src/utils/hash-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async getResponse(user: any): Promise<loginUserResponseDTO> {
    const userObject = user.toObject();
    const option = {};
    delete userObject.password;
    return {
      user: userObject,
      accessToken: await this.jwtService.signAsync({
        userId: userObject._id,
        ...option,
        email: userObject.email,
      }),
    };
  }
  async registerUser(user: registerUserDTO): Promise<User> {
    const userExist = await this.userModel.findOne({ email: user.email });
    if (userExist) {
      throw new BadRequestException(
        `User with this email: ${user.email} already exists.`,
      );
    }
    user.password = await hashManager().hash(user.password);
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  async loginUser(
    user: loginUserDTO,
  ): Promise<loginUserResponseDTO | undefined> {
    try {
      const userExist = await this.userModel.findOne({ email: user.email });
      if (!userExist) {
        throw new NotFoundException(
          `User with this email: ${user.email} does not exists.`,
        );
      }

      const validate = await hashManager().compare(
        user.password,
        userExist.password,
      );
      if (validate) {
        const response = await this.getResponse(userExist);

        return {
          user: response.user,
          accessToken: response.accessToken,
        };
      }
      throw new UnauthorizedException('Invalid Login Details');
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
