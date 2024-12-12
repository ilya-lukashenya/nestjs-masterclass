import {
    Inject,
    Injectable,
    OnModuleInit,
    UnauthorizedException,
    forwardRef,
  } from '@nestjs/common';
  import { ConfigType } from '@nestjs/config';
  import jwtConfig from 'src/auth/config/jwt.config';
  import { OAuth2Client } from 'google-auth-library';
  import { UsersService } from 'src/users/providers/users.service';
  import { GoogleTokenDto } from '../dtos/google-token.dto';
  import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from 'src/users/user.entity';
  
  @Injectable()
  export class GoogleAuthenticationService implements OnModuleInit {
    private oauthClient: OAuth2Client;
  
    constructor(
      @Inject(forwardRef(() => UsersService))
      private readonly usersService: UsersService,

      @Inject(jwtConfig.KEY)
      private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

      private readonly generateTokensProvider: GenerateTokensProvider,
    ) {}
  
    onModuleInit() {
      const clientId = this.jwtConfiguration.googleClientId;
      const clientSecret = this.jwtConfiguration.googleClientSecret;
      this.oauthClient = new OAuth2Client(clientId, clientSecret);
    }
  
    async authenticate(googleTokenDto: GoogleTokenDto) {
      try {
        const loginTicket = await this.oauthClient.verifyIdToken({
          idToken: googleTokenDto.token,
        });
        const {
          email,
          sub: googleId,
          given_name: firstName,
          family_name: lastName,
        } = loginTicket.getPayload();
        let user = await this.usersService.findOneByGoogleId(googleId);
        console.log(loginTicket);
        if (!user) {
          user = await this.usersService.createGoogleUser({
            email: email,
            firstName: firstName, 
            lastName: lastName,
            googleId: googleId,
          });
        }
        return await this.generateTokensProvider.generateTokens(user);
      } catch (error) {
        throw new UnauthorizedException(error);
      }
    }
  }