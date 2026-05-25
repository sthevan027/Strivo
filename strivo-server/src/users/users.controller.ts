import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Get('search')
  search(@CurrentUser() user: CurrentUser, @Query('q') q: string) {
    return this.users.search(q ?? '', user.userId);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: CurrentUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.userId, dto);
  }

  @Post(':id/follow')
  follow(
    @CurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) targetId: number,
  ) {
    return this.users.follow(user.userId, targetId);
  }

  @Delete(':id/follow')
  unfollow(
    @CurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) targetId: number,
  ) {
    return this.users.unfollow(user.userId, targetId);
  }
}
