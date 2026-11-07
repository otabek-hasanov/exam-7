export class AuthUserDto {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: AuthUserDto;
}
