// npm install class-validator class-transformer 
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class RegisterUserDto { 
    @IsNotEmpty() // 不能为空
    @IsString() // 必须是字符串
    @Length(6, 20) // 长度6-20
    @Matches(/^[A-Za-z0-9_-]+$/, {
    message: '用户名只能包含字母、数字、下划线和破折号',
    })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d_%$]+$/, {
    message:
      '密码只能包含字母、数字和特殊符号_、%、$,并且至少包含一个大小写字母和数字',
  })
  password: string;
}
