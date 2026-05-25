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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateUploadDto } from './dto/create-upload.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post('uploads')
  createUpload(
    @CurrentUser() user: CurrentUser,
    @Body() body: CreateUploadDto,
  ) {
    return this.posts.createUpload(user.userId, body);
  }

  @Post()
  createPost(@CurrentUser() user: CurrentUser, @Body() body: CreatePostDto) {
    return this.posts.createPost(user.userId, body);
  }

  @Get('feed')
  getFeed(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
  ) {
    return this.posts.getFeed(limit, cursor);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.posts.getPostById(id);
  }
}
