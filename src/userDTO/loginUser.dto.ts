import { IsNotEmpty, IsEmail } from 'class-validator';

export class loginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class IUserDTO {
  email: string;
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export class loginUserResponseDTO {
  user: IUserDTO;
  accessToken: string;
}
