import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateUploadDto } from './dto/create-upload.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post('uploads')
  @ApiOperation({ summary: 'Solicitar URL de upload de mídia' })
  @ApiResponse({
    status: 201,
    description: 'URL assinada para upload no Supabase',
  })
  createUpload(
    @CurrentUser() user: CurrentUser,
    @Body() body: CreateUploadDto,
  ) {
    return this.posts.createUpload(user.userId, body);
  }

  @Post()
  @ApiOperation({ summary: 'Criar post com mídias previamente enviadas' })
  @ApiResponse({ status: 201, description: 'Post criado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Mídia inválida ou não pertence ao usuário',
  })
  createPost(@CurrentUser() user: CurrentUser, @Body() body: CreatePostDto) {
    return this.posts.createPost(user.userId, body);
  }

  @Get('feed')
  @ApiOperation({ summary: 'Listar feed de posts (cursor-based pagination)' })
  getFeed(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.posts.getFeed(limit, cursor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar post por ID' })
  @ApiResponse({ status: 404, description: 'Post não encontrado' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.posts.getPostById(id);
  }
}
