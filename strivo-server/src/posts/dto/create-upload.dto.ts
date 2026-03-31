import { IsIn, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateUploadDto {
  @IsIn(['photo', 'video'])
  kind!: 'photo' | 'video';

  @IsString()
  mimeType!: string;

  @IsInt()
  @Min(1)
  @Max(1024 * 1024 * 1024) // 1GB hard cap (MVP)
  size!: number;
}

