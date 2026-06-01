import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RankingService } from './ranking.service';

@ApiTags('ranking')
@ApiBearerAuth()
@Controller('ranking')
@UseGuards(JwtAuthGuard)
export class RankingController {
  constructor(private readonly ranking: RankingService) {}

  @Get()
  @ApiOperation({ summary: 'Retornar ranking de usuários mais seguidos' })
  getRanking(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.ranking.getRanking(limit);
  }
}
