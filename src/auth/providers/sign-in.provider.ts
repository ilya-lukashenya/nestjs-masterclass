import {
    Inject,
    Injectable,
    RequestTimeoutException,
    UnauthorizedException,
    forwardRef,
  } from '@nestjs/common';
  import { UsersService } from 'src/users/providers/users.service';
  import { SignInDto } from '../dtos/signin.dto';
  import { HashingProvider } from './hashing.provider';
  import { JwtService } from '@nestjs/jwt';
  import jwtConfig from '../config/jwt.config';
  import { ConfigType } from '@nestjs/config';
  
  @Injectable()
  export class SignInProvider {
    constructor(
      @Inject(forwardRef(() => UsersService))
      private readonly usersService: UsersService,
  
      private readonly hashingProvider: HashingProvider,
  
      private readonly jwtService: JwtService,

      @Inject(jwtConfig.KEY)
      private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {}
  
    public async signIn(signInDto: SignInDto) {
      let user = await this.usersService.findOneByEmail(signInDto.email);
  
      let isEqual: boolean = false;
  
      try {
        isEqual = await this.hashingProvider.comparePassword(
          signInDto.password,
          user.password,
        );
      } catch (error) {
        throw new RequestTimeoutException(error, {
          description: 'Could not compare the password',
        });
      }
  
      if (!isEqual) {
        throw new UnauthorizedException('Password does not match');
      }
  
      const accessToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
          secret: this.jwtConfiguration.secret,
          expiresIn: this.jwtConfiguration.accessTokenTtl,
        },
      );
  
      return {
        accessToken,
      };
    }
  }