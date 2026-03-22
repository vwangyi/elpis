import { SetMetadata } from '@nestjs/common';

/* 自己实现的一个注解： 大概就是就是 把isPublic的值 设置为 true  默认情况 isPublic的值为false */

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
