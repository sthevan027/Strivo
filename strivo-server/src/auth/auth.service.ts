import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private getSaltRounds() {
    return Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
  }

  private getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? '';
  }

  private signTokens(userId: number, email: string) {
    const access_token = this.jwt.sign({ sub: userId, email });
    const refresh_token = this.jwt.sign(
      { sub: userId, email },
      { secret: this.getRefreshSecret(), expiresIn: '7d' },
    );
    return { access_token, refresh_token };
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const saltRounds = this.getSaltRounds();
    const hashed = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashed,
        username: dto.username ?? null,
        phone: dto.phone ?? null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
      },
    });

    const tokens = this.signTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refresh_token, saltRounds);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: hashedRefresh },
    });

    return { ...tokens, user };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const tokens = this.signTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refresh_token, this.getSaltRounds());
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: hashedRefresh },
    });

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    };
  }

  async refreshTokens(userId: number, rawRefreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.refresh_token) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    const matches = await bcrypt.compare(rawRefreshToken, user.refresh_token);
    if (!matches) {
      throw new UnauthorizedException('Refresh token inválido.');
    }

    const tokens = this.signTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refresh_token, this.getSaltRounds());
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: hashedRefresh },
    });

    return tokens;
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
  }
}
