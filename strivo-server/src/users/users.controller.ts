import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: CurrentUser) {
    return this.users.getMe(user.userId);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: CurrentUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.userId, dto);
  }
}
