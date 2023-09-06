import { JwtService } from '@nestjs/jwt';

export type SignJwtType = {
  pollId: string;
  name: string;
  subject: string;
};

export class JwtUtil {
  constructor(private readonly jwtService: JwtService) {}
  signToken(data: SignJwtType) {
    const signedToken = this.jwtService.sign(
      {
        pollId: data.pollId,
        name: data.name,
      },
      {
        subject: data.subject,
      },
    );

    return signedToken;
  }
}
