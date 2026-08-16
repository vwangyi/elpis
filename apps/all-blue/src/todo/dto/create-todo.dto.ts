import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Length,
  IsIn
} from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString()
  @Length(1, 100, { message: '标题长度需在1-100之间' })
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: '描述长度不能超过500' })
  description?: string;

  @IsOptional()
  @IsInt({ message: '状态必须为整数' })
  @IsIn([0, 1], { message: '状态值只能为0(未完成)或1(已完成)' })
  status?: number;
}
