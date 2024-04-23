import { IsEmail, IsNotEmpty } from 'class-validator';

export class registerUserDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  mobile: string;
}
