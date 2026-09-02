import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsNumber()
  email?: number;

  @IsOptional()
  @IsString()
  birthday?: string;

  // 追加字段
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  japaneseName?: string;

  @IsOptional()
  @IsString()
  epithet?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  affiliation?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsNumber()
  bounty?: number;

  @IsOptional()
  @IsString()
  devilFruit?: string;

  @IsOptional()
  @IsString()
  dream?: string;
}
