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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retornar perfil do usuário autenticado' })
  getMe(@CurrentUser() user: CurrentUser) {
    return this.users.getMe(user.userId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar usuários por nome ou username' })
  search(@CurrentUser() user: CurrentUser, @Query('q') q: string) {
    return this.users.search(q ?? '', user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
  updateMe(@CurrentUser() user: CurrentUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(user.userId, dto);
  }

  @Post(':id/follow')
  @ApiOperation({ summary: 'Seguir um usuário' })
  @ApiResponse({ status: 201, description: 'Seguindo o usuário' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  follow(
    @CurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) targetId: number,
  ) {
    return this.users.follow(user.userId, targetId);
  }

  @Delete(':id/follow')
  @ApiOperation({ summary: 'Deixar de seguir um usuário' })
  unfollow(
    @CurrentUser() user: CurrentUser,
    @Param('id', ParseIntPipe) targetId: number,
  ) {
    return this.users.unfollow(user.userId, targetId);
  }
}
