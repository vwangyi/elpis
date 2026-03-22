+ 在线编译 C++：<font style="color:rgb(249, 250, 251);">:</font>[https://www.onlinegdb.com/](https://www.onlinegdb.com/) 
+ 
+ index
    - 程序语言分类 分为三类
        * 低级语言
            + 机器语言
                - 依赖于 CPU的指令系统 使用二进制代码0和1来编写程序 直接被机器识别并执行
            + 汇编语言
                - 使用助记符编写程序 属于符号化的机器语言 通用性差
            + 低级语言可以直接操作寄存器和内存
        * 中级语言
        * 高级语言
            + c c++ java js php
            + c++ 
                - 面向用户的语言 通用性强
    - c和c++
        * c++是c的超集 进一步扩展了c 新增了面向对象 c++比c更安全
        * c++是一种编译式 通用式 大小写敏感 的编程语言 完全支持面向对象程序设计
        * c++相比c最大的改进是  新增了面向对象
        * c++ 是编译型语言  把源文件.cpp 编译为 .obj文件，将所有的.obj文件 连接成 .exe文件



## Hello World
```cpp
// index.cpp

// 常用的头文件
#include <iostream> //  标准的输入输出流  使用cout 或 cin 就必须包含这个头文件
#include <fstream> //  标准的文件流
#include <string> //  标准的字符串处理函数 c++新增 可以用string类
#include <cmath> //  标准的数学函数
using namespace std; // 使用 std这个命名空间

int a = 1;
char hello[] = "Hello "; // C没有string 只能用char字符数组 来表示字符串
string world = "World"; // c++ 需要引入 #include <string> 头文件 才可以使用string

 
int init() 
{
    cout << hello << world << endl; // Hello World

    // 如果不使用命名空间 就需要加 std:: 前缀 很麻烦
    // std::cout << hello << world << std::endl; 
    return 0;
}

// 初始化执行 main函数是入口函数 一个程序有且仅有一个main函数
int main() 
{
    init();
    return 0;
}

```





## 输入输出
```cpp
#include <iostream> 
using namespace std; 
#include <string> 
int main()
{
    int one; // 声明2个int整数变量
    // char strArr[20]; // 声明一个字符数组
    // string str; // 声明一个string字符串
    // double d; // 声明一个浮点数
    // char c = 'a'; // 声明一个字符并赋值a


    // 空格 tab enter 三个键都可以分隔每个变量
    // cin >> one >> two >> strArr >> str >> d >> endl;
    cin >> one;

    
    /* cout 和 cin 分别是 ostream类 和  istream类 的对象 */
    // cout是标准输出流对象 cin是标准输入流对象
    // << 是 插入操作符  >> 提取操作符 
    // endl 是换行符
    cout << "Hello World" << endl;
    
    return 0;
}


```

## 普通变量
```cpp
int mian() 
{
    int a = 0;
}
```

## 引用变量
```cpp
/**
 * 引用相当于给变量起了一个别名
 * 类型名 &别名 = 同类型的某变量名（原名）
 * 常引用和普通引用的区别在于：常引用不能通过别名修改原变量的值 
 */

// 引用必须初始化且不能改（不能是悬空引用）
#include <iostream> 
using namespace std;   
int main()
{  
    int a = 10; // 定义一个变量a 并赋值10
    int &b = a; // 定义一个引用b    b指向于a 
    const int &c = a; // 定义一个常引用c  c指向于a 
    b = 20; // 通过引用名（别名）修改原变量的值
    cout << "a = " << a << endl; // a = 20
    cout << "b = " << b << endl; // b = 20
    cout << "c = " << c << endl; // c = 20
    a = 40; // 通过原变量名修改原变量的值
    cout << "a = " << a << endl; // a = 40
    cout << "b = " << b << endl; // b = 40
    cout << "c = " << c << endl; // c = 40
    
    
    // c = 100; // 错误，常引用不能指向新的值
    // int &e = c; // 错误，普通引用 不能指向 常引用
    // int &e = a; // 正确  普通引用 可以指向 普通引用
    int &e = b; // 正确  普通引用 可以指向 普通引用
    return 0;
}

```



## 指针变量
```cpp

#include <iostream> 
using namespace std;


int init()
{
    // 指针：就是引用地址 
    
    // *p 表示解变量p的
    
    int a = 1;
    
    int *p; // 声明一个指针变量 
    p = &a; // 把普通变量的地址取出来 赋值给 指针变量
    int *i = &a; // 
    
    
    // p // 指针变量p 里面是一个引用地址
    // &p // 对指针变量取地址 取地址
    // *p // 对指针变量解地址 取值

    // 0x7fffe969b9e4
    // 0x7fffe969b9d8
    // 1
    
    cout << p << endl;
    cout << &p << endl;
    cout << *p << endl;
    return 0;
}

int main()
{
    init();
    return 0;
}



//     int a = 1024;
//     int *ia = &a;                   //&在右边，叫作取地址，&a是变量a的地址
//     int &b = a;                     //&在左边，叫作引用，b和a一样
//     cout << "&a  =" << &a << endl;  // 取地址符  取变量a的地址


//     cout << "ia  =" << ia << endl;  // 保存的是 
//     cout << "&ia =" << &ia << endl; // &ia是指针ia的地址，系统分配的
//     cout << "*ia =" << *ia << endl; //*是解地址，即取ia所指向的值



// &a  =0x61ff08
// ia  =0x61ff08
// &ia =0x61ff04
// *ia =1024    
//   a =1024
//   b =1024
//  &b =0x61ff08
```

```cpp



## c++
```cpp
int a = 1; // 声明一个变量a 并赋值1
int *p; // 创建指针变量p  变量p里面保存的是一个指针
int &b; // 创建引用变量b  变量b里面保存的是一个引用
// &取地址符
p = &a; // 把变量a的地址赋值给指针变量p
int *p = &a; // 声明一个指针变量p 并赋值为变量a的地址     

// &a在赋值号右边 表示 取变量a的地址
// *p在赋值号右边 表示 解变量p的地址
// &a在赋值号左边 表示 变量a的类型是int *p


int a = 1; // 声明一个变量a 并赋值1

// &a在赋值号右边 表示 取变量a的地址 所以 &a返回的是变量a的地址   
// *b在赋值号左边 表示 变量b是一个指针变量
// 而一个指针变量 是可以 指向一个地址的 所以把一个地址赋值给指针变量 是可以的   
int *b = &a; // 把一个地址值 赋值给 指针变量

// &c在左边 表示 变量c是一个引用变量 而右边a本身就是一个引用 
// 把一个引用 赋值给 一个引用变量 是可以的
int &c = a; // 把一个引用值 赋值给 引用变量

int *p; // 指针变量p
*p // 解指针变量的地址  把p的地址解析出来 这个 *和上面的*不一样 这个p和上面的p是一样的    p是指针变量装的一个地址 *p是把这个地址解出来 得到一个值
cout << p << endl; // 输出指针变量p的地址
cout << *p << endl; // 输出指针变量p的地址解析出来的值
int &b; // 引用变量
&b // 取引用变量的地址
cout << b << endl; // 输出引用变量b的地址
cout << &b << endl; // 输出引用对应的值

int *p = &b; // 一个指针变量 可以执行一个地址 
int &b = *p; // 一个引用变量 可以指向一个地址

如果不是在定义中，那么*表示解地址，&表示取地址，例如，*地址：表示得到该地址内存储的数据；&变量：表示得到存储该变量数据的地址。

这句话 初步理解 如果不是定义中 那么  *地址 和 &变量 是相反的   
    *地址变量 也就是 解地址变量 得到一个数据    
    &普通变量 也就是 取普通变量的地址 得到一个地址
    
    cout << 地址变量 << endl;
    cout << 普通变量 << endl; 

https://blog.csdn.net/u011895157/article/details/123547591
```

```cpp

// 指针 pointer 

指针的作用： 可以通过指针间接访问内存

指针可以保存一个地址（指针就是一个地址）

定义一个指针

如何使用指针



#include <iostream>
using namespace std;


void init() 
{
    // 1 定义一个指针
    int a = 10; // 定义一个变量a 并赋值10
    int * p; // 定义一个指针变量p

    // 普通变量赋值的是具体的数值
    // 指针变量赋值的是地址

    p = &a; // 取出变量a的地址 赋值给 指针变量p

    cout << "a的地址为" << &a << endl;
    cout << "指针变量p的值为" << p << endl;

    // 2 如何使用指针
    // 可以通过解引用的方式 来找到 指针指向的内存
    // 指针名前加 * 号 表示解引用 找到指针指向的内存中的数据

    // p // 是一个指针变量 打印出来是一个地址
    // *p // 解引用 打印出来是 数据10

    *p = 1000; // 把原来的10改为了1000
    cout << "a = " << a << endl; // a = 1000

}

int main()
{

}




// 指针

// 指针的作用：可以通过指针间接访问内存

// 内存编号是从0开始编号的 一般是16进制表示
// 可以利用指针变量保存地址

void pointer() 
{
    // 1 定义一个指针
    int a = 10; // 定义一个变量a 并赋值10
    int * p; // 定义一个指针变量p

    // 普通变量赋值的是具体的数值
    // 指针变量赋值的是地址

    p = &a; // 取出变量a的地址 赋值给 指针变量p

    cout << "a的地址为" << &a << endl;
    cout << "指针变量p的值为" << p << endl;

    // 2 如何使用指针
    // 可以通过解引用的方式 来找到 指针指向的内存
    // 指针名前加 * 号 表示解引用 找到指针指向的内存中的数据

    // p // 是一个指针变量 打印出来是一个地址
    // *p // 解引用 打印出来是 数据10

    cout << "*p = " << *p << endl; // *p = 10

    *p = 1000; // 把原来的10改为了1000
    cout << "a = " << a << endl; // a = 1000
    cout << "*p = " << *p << endl; // *p = 1000

}

// 3 指针所占用内存空间
// 指针也是一个数据类型 那么这种数据类型占用多少内存空间

// 32位操作系统下 占用4个字节空间
// 64位操作系统下 占用8个字节空间

int pointer1() 
{
    int a = 10;
    // int * p; 
    // p = &a;
    int * p = &a; 

    cout << "sizeof(int *) = " << sizeof(int *) << endl; // 4  都是4个字节
    cout << "sizeof(p) = " << sizeof(p) << endl; // 4   都是4个字节 

    // 初步理解 int * 是一个数据类型 p是一个变量名 

    cout << "sizeof(int *) = " << sizeof(int *) << endl; // 4  32位操作系统下 占用4个字节空间  64位操作系统下 占用8个字节空间
    cout << "sizeof(int *) = " << sizeof(float *) << endl; // 4  32位操作系统下 占用4个字节空间  64位操作系统下 占用8个字节空间
    cout << "sizeof(int *) = " << sizeof(double *) << endl; // 4  32位操作系统下 占用4个字节空间  64位操作系统下 占用8个字节空间
    cout << "sizeof(int *) = " << sizeof(char *) << endl; // 4  32位操作系统下 占用4个字节空间  64位操作系统下 占用8个字节空间

}


int nullPointer() 
{
    // 4 空指针 指针变量指向内存中编号为0的空间
    // 用途： 初始化指针变量
    // 注意：空指针指向的内存是不可以访问的

    内存编号是从0开始编号的 一般是16进制表示  指针指向的内存编号为0的指针 叫空指针

    一开始你不知道指针指向谁 可以先让指针指向空地址 0 所以空指针用途就是 初始化指针变量

    0-255这块内存是系统占用的 一旦访问就会出错

    // 空指针用于给指针变量进行初始化
    int * p = NULL; // NULL是一个宏定义 代表0

    // 空指针是不可以进行访问的
    *p = 100; // 错误 空指针是不可以进行访问的
    

    //5  野指针 指针变量指向非法的内存空间 

    int * p = (int *)0x1100; // 0x1100是我随便给的一个地址 不是系统分配的  （int *）是强转为int类型的指针   
    // 上面的写法是错误的
    cout << "*p = " << *p << endl; // 错误 野指针是不可以进行访问的

    // 比如 你去宾馆开房 你开了001或根本没有开 但你直接去002 这肯定是不允许的  你指向002 那就是野指针
    // 必须使用系统分配的地址 而不是自己随便写一个地址

    // 总结 空指针和野指针 都不是我们通过正规途径申请的空间 所以我们不可以访问


    // const修饰指针   常量指针 和 指针常量 和 既修饰指针 又修饰常量 这三种情况

    int a = 10;
    int b = 20;

    int * p = &a;


    //6 常量指针
    const int * p2 = &a; // 常量指针 指针的指向可以修改 但指针指向的值不可以修改

    *p2 = 100; // 不可以修改  *p是解引用的操作 也就是指针指向的值
    p2 = &b; // 可以修改  指针的指向可以修改


    //7 指针常量 
    int * const p3 = &a; // 指针常量 指针的指向不可以修改 但指针指向的值可以修改

    *p3 = 100; // 可以修改  *p是解引用的操作 也就是指针指向的值
    p3 = &b; // 不可以修改  指针的指向不可以修改


    // 指针常量和常量指针是反过来的


    // 8 const 既修改指针 又修改常量

    const int * const p4 = &a; // 既修改指针 又修改常量 指针的指向不可以修改 但指针指向的值不可以修改

    *p4 = 100; // 不可以修改  *p是解引用的操作 也就是指针指向的值
    p4 = &b; // 不可以修改  指针的指向不可以修改


    // 总结 const 修饰谁 谁就不可以改



    // 9 指针和数组 
    // 利用指针访问数组中的元素

    int arr[10] = { 1,2,3,4,5,6,7,8,9,10 };
    cout << "利用下标访问第一个元素：" << arr[0] << endl; // 1
    
    int * p = arr; // 数组名是一个地址 也就是数组的首地址

    cout << "利用指针访问第一个元素：" << *p << endl; // 1

    p++; // 指针++ 指向下一个元素
    cout << "利用指针访问第二个元素：" << *p << endl; // 2

    int * p2 = arr; // 这是一个新的指针
    for (int i = 0; i < 10; i++)
    {
        cout << *p2 << endl;
        p2++;
    }


    
}



```

```

## 数组
```cpp
/*
    理论知识 
    
*/

int arr[2]; /* 声明一个长度为2的数组变量 */
arr[0] = 1; /* 给数组第1个元素赋值为1 */ 
arr[1] = 2; /* 给数组第2个元素赋值为2 */ 
int arr1[3] = { 1, 2, 3 }; // 声明一个长度为3的数组 并赋值为 1,2,3

// 常用
int arr[] = { 1, 2 }; // 立马赋值的 不需要在声明时给长度 

cout << arr << endl; //  0x7ffeeb7f3a10 打印数组 首地址
cout << sizeof(arr) << endl; // 打印数组占用多少字节
cout << sizeof(arr) / sizeof(arr[0]) << endl; // 打印数组长度



int arr1[2][3]; // 声明2行3列的二维数组
// 赋值
arr[0][0] = 1;
arr[0][1] = 2;
arr[0][2] = 3;
arr[1][0] = 4;
arr[1][1] = 5;
arr[1][2] = 6;

// 常用 比较直观
int arr2[2][3] =  
{
    { 1, 2, 3 }, 
    { 4, 5, 6 }
};

int arr2[2][3] = { 1, 2, 3, 4, 5, 6 }; // 左边给了2行3列 右边不用给



// 定义方式
// 方式1
// 数据类型 数组名[行数][列数];  int arr[2][3]; 
int arr[2][3]; // 2行3列
arr[0][0] = 1;
arr[0][1] = 2;
arr[0][2] = 3;
arr[1][0] = 4;
arr[1][1] = 5;
arr[1][2] = 6;
// 方式2
int arr2[][] =  // 很直观是2行3列
{
    {1, 2, 3}, 
    {4, 5, 6}
};
// 方式3 
int arr2[2][3] = { 1, 2, 3, 4, 5, 6 }; // 左边给了2行3列 右边不用给

// 方式4 左边只给列数 右边有6个数 仍然可以推断出是 2行3列
int arr3[][3] = { 1, 2, 3, 4, 5, 6 }; 

```

## 函数
```cpp


// 函数声明  函数可以多次声明
void init(int a, int b = 1); 


// 函数定义   函数定义 只能定义一次
int init(int a, int b = 1)
{
    int c = a + b;
    return c;
}

// 函数默认值 只能 从右往左 给
// 函数形参默认值：必须从右往左给默认值 因为调用是从左往右
void fun(int a, int b, int c = 3);
void fun(int a, int b = 2, int c = 3);

/**
 * 内链函数
 * 应用场景 在比较短小的程序里面  内容不是很多 但是频繁的调用  
 * 不适合太复杂的程序 不适合有switch或循环的程序
 */
inline void fun(int a, int b)
{ 
    cout << a + b << endl;
}


// 函数的重载
// 是什么 ？ 函数名相同 参数类型不同或者个数不同   main函数不能重载 一个.cpp文件中只能有一个main函数
// 函数重载 体现了一种多态的思想
// 重载的函数调用是根据参数的类型和个数来区分的


``` 
## 函数分文件编写
> swap.h 头文件中声明函数
```cpp 
#include <iostream>
using namespace std; 
// 函数声明
void swap(int a, int b);
```
> swap.cpp文件中定义函数
```cpp
// 引用swap.h头文件
#include "swap.h"

// 函数定义
void swap(int a, int b) 
{
    int temp = a;
    a = b;
    b = temp;
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
}

int main() 
{
    int a = 10;
    int b = 20;
    swap(a, b);
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
    system("pause");
    return 0;
}
```

## 函数的值传递和引用传递
```cpp
 
#include <iostream>
using namespace std;


int fn(int a, int b)
{
    int temp = a;
    a = b;
    b = temp;
}

int fn1(int * p1, int * p2)
{
    int temp = *p1;
    *p1 = *p2;
    *p2 = temp;
}
int main()
{
    int a = 10;
    int b = 20;
    // 值传递  
    fn(a, b); 

    // 引用传递
    fn1(&a, &b); // 用取地址符 传递的是地址 

    cout << a << endl;
    cout << b << endl;


    // 当是值传递的时候 里面形参的改变不会影响到外面实参的值
    // 当是引用传递的时候 里面形参的改变会影响到外面实参的值 因为地址指向同一块内存



}




// 函数

// 函数的参数是值传递
// 目前来说就是 深拷贝 形参的值发生改变 不会影响实参的值

// 函数常见的形式
// 有参无返
// 有参有返
// 无参无返
// 无参有返


函数的声明可以多次 但是函数的定义只能有一次

// 函数的声明
int fun(int a, int b); 

// 函数的定义
int fun(int a, int b) 
{
    return a + b;
}

// 变量的声明 
int a; 
// 变量的定义
int a = 10;


```
```





```markdown
## 函数
```cpp
  

// 函数的参数是值传递
// 目前来说就是 深拷贝 形参的值发生改变 不会影响实参的值

// 函数常见的形式
// 有参无返
// 有参有返
// 无参无返
// 无参有返
 
``` 
## 函数分文件编写
> swap.h 头文件中声明函数
```cpp 
#include <iostream>
using namespace std; 
// 函数声明
void swap(int a, int b);
```
> swap.cpp文件中定义函数
```cpp
// 引用swap.h头文件
#include "swap.h"

// 函数定义
void swap(int a, int b) 
{
    int temp = a;
    a = b;
    b = temp;
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
}

int main() 
{
    int a = 10;
    int b = 20;
    swap(a, b);
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
    system("pause");
    return 0;
}
```

## 函数的值传递和引用传递
```cpp
 
#include <iostream>
using namespace std;


int fn(int a, int b)
{
    int temp = a;
    a = b;
    b = temp;
}

int fn1(int * p1, int * p2)
{
    int temp = *p1;
    *p1 = *p2;
    *p2 = temp;
}
int main()
{
    int a = 10;
    int b = 20;
    // 值传递  
    fn(a, b); 

    // 引用传递
    fn1(&a, &b); // 用取地址符 传递的是地址 

    cout << a << endl;
    cout << b << endl;


    // 当是值传递的时候 里面形参的改变不会影响到外面实参的值
    // 当是引用传递的时候 里面形参的改变会影响到外面实参的值 因为地址指向同一块内存



}


 

// 函数的参数是值传递
// 目前来说就是 深拷贝 形参的值发生改变 不会影响实参的值

// 函数常见的形式
// 有参无返
// 有参有返
// 无参无返
// 无参有返


函数的声明可以多次 但是函数的定义只能有一次

// 函数的声明
int fun(int a, int b); 

// 函数的定义
int fun(int a, int b) 
{
    return a + b;
}

// 声明一个变量 定义一个变量
int a; 
// 变量的定义
int a = 10;


```
```



## 类
```cpp
// 声明一个类   类的作用就是 创建对象
class 类名
{
    访问权限符: // public protected private
    成员属性; // 只能定义变量 不能初始化变量 就是不能赋值
    访问权限符: 
    成员函数; // 可以定义函数 也可以实现函数
}
```

## 函数默认值
```cpp
#include <iostream>  
    using namespace std;  
    #include <string>

// c++规定 提供默认值 必须从右向左依次提供 
    void func(int a = 11, int b = 22, int c = 33)
    {
        cout << "a = " << a << " b = " << b << " c = " << c << endl;
    }

    // main函数是入口函数 一个程序有且仅有一个main函数
    int main()
    { 
        func(); // a = 11 b = 22 c = 33
        func(55); // a = 55 b = 22 c = 33
        func(55, 66); // a = 55 b = 66 c = 33
        func(55, 66, 77); // a = 55 b = 66 c = 77
        return 0;
    }
    // 在终端运行程序
    // g++ -o 自定义文件名 复制的文件路径
    // ./自定义文件名
```



## 函数重载
```cpp
// 函数
// 函数重载

// 函数重载可以使一个函数具有多种功能 即具有 "多种形态" 多态性

// 多态 就是 一个函数名 具有多种形态

// 只有函数名相同 参数个数不同或参数的类型不同 

// 返回值类型和引用参数不同  不能作为函数重载的依据



// 源代码只指明函数调用 而不说明调用哪种形态的函数 
// 编译器的这种连接方式 称为动态联编 或 迟后联编
// 在动态联编中 直到程序运行才能确定调用哪种形态的函数

// 函数重载机制 减少了命名空间的浪费 只使用了一个函数名达到了多种功能的目的

// 函数重载提现的是 编译时的多态性

// 函数名相同 形参个数相同 形参类型相同 就是重复定义一定报错

#include <iostream>
using namespace std;

int bigger(int x, int y)
{
    if(x > y)
        return x;
    else
        return y;
}
float bigger(float x, float y)
{
    if(x > y)
        return x;
    else
        return y;
}
double bigger(double x, double y)
{
    if(x > y)
        return x;
    else
        return y;
}

int main()
{
    int a = 1, b = 2;
    float c = 1.1, d = 2.2;
    double e = 1.1, f = 2.2;
    cout << bigger(a, b) << endl;
    cout << bigger(c, d) << endl;
    cout << bigger(e, f) << endl;
    return 0;
}
```





## 动态内存分配
```cpp
// 1、动态内存分配
// C++提供了一种“动态内存分配”机制，
// 在程序运行期间，根据实际需要，临时分配一段内存空间用于存储数据。

// 静态内存分配 
// 静态内存分配是在编译时就确定占用的内存大小，

// 动态内存分配 
// 动态内存分配是在运行期间才确定占用内存大小。

// 使用关键字 new 实现动态内存分配

// T *p = new T; // 分配大小为sizeof(T)字节 的内存空间
// T *p = new T(N); // 分配一个任意大小的数组 N为数组元素个数

// // 使用完毕 用 delete释放内存空间
// delete p; // 释放p指向的内存空间
// delete []p; // 释放p指向的数组空间




// 例

#include <iostream>
using namespace std;
#define N 5 // 定义一个常量

void insert_sort(int a[], int n) // 直接插入排序
{
    int i, j, temp;
    for(i = 1; i < n; i++)
    {
        temp = a[i];
        j = i - 1;
        while(j >= 0 && a[j] > temp)
        {
            a[j + 1] = a[j];
            j--;
        } 
        a[j + 1] = temp;
    }

}

int main()
{
    int *pArray;
    int i;
    pArray = new int[N]; // 动态分配数组 N为上面定义的常量
    for(i = 0; i < N; i++)
        cin >> pArray[i];
    insert_sort(pArray, N); // 调用排序函数
    for(i = 0; i < N; i++)
        cout << pArray[i] << " ";
    return 0;
}
```

## String
```cpp

#include <string>  // C++新增string类 使用string类必须包含这个头文件
// string str1;
// string str2 = "Hello";
// string str3 = str2;

// 不管字符串长度如何 string对象的大小都是 sizeof(string)
// 字符数组的定义： 
// string citys[] = {"Beijing", "Shanghai", "Guangzhou", "Shenzhen"};

// string对象处理字符串

// string s1, s2 = "Hello";
// s1 = "World";
// s2 = s1;
// string对象之间可以相互赋值 前提都是string类型

// string对象之间可以比较大小

// < <= != == > >=等运算符比较
// 大小按字母顺序 区别大小写 
//  + 号 作为字符串的连接符号

// 例:

// 声明一个string对象 str1
// string 变量名;

// char name [] = "Zhang San";
// string str1 = name; // 将字符数组name赋值给str1

// string citys[] = {"Beijing", "Shanghai", "Guangzhou", "Shenzhen"};
// cout << citys[1] << endl; // 输出Shanghai
// cout << sizeof(citys)/sizeof(string) << endl; // 输出16

// string对象之间可以用 < <= != == > >=等运算符比较大小
// 大小按字母顺序 区别大小写

// string对象之间可以用 +运算符 连接

// C 没有string 只能用char 字符数组 来表示字符串
// C++ 新增了string类 用string对象来表示字符串

#include <iostream>
#include <string>
using namespace std;
int main()
{
    string str1, str2; // 声明两个string对象
    str1 = "Hello"; // 用字符串常量赋值
    str2 = str1; // 用string对象赋值
    string str3;
    cout << "str3=" << str3 << endl; // 输出str3 
    str3 = str1 + str2; // 用+号连接两个string对象
    cout << str1 + str2 << endl;
    cout << "str3=" << str3 << endl; // 输出str3 
    bool b = str1 < str3; // 用<号比较两个string对象
    cout << "bool=" << b << endl; // 输出bool
    char c = str1[2]; // 用[]取出string对象中的字符
    cout << "c=" << c << endl; // 输出c
    cout << str1[2] << endl; // 输出str1[2]
    char arrstr[] = "Hello"; // 声明一个字符数组
    str3 = str1 + arrstr; // 用+号连接string对象和字符数组
    cout << "str3=" << str3 << endl; // 输出str3
    return 0;
}

// str3=
// HelloHello
// str3=HelloHello
// bool=1
// c=l
// l
// str3=HelloHello
```



## String类的成员函数
```cpp
#include <iostream>  
using namespace std;  
#include <string>

// string类的成员函数 （常用的） 类似数组的常用方法


// string str; // 声明一个string对象 str是string类的实例对象 默认值为''
// str.empty() 判断str是否为空
// str.size() 返回str的长度
// str.append("abcdefg") 在str后面追加字符串"abcdefg"
// str.c_str() 返回str的首地址
// str.find("abc", 0) 查找字符串"abc"在str中的位置
// str.insert(4, "123") 在str的第4个位置插入字符串"123"
 
int main()
{ 

    string str;
    if(str.empty())
        cout << "str为空" << endl;
    else 
        cout << "str不为空" << endl;
    str = str.append("abcdefg");
    cout << "str=" << str << endl;
    cout << "str.size()=" << str.size() << endl;
    const char *p = str.c_str();
    cout << "p=" << p << endl;
    cout << "str.find(\"abc\", 0)=" << str.find("de", 0) << endl;
    cout << "str.find(\"abc\", 0)=" << str.find("de", 4) << endl;
    string str1 = str.insert(4, "123");
    cout << "str1=" << str1 << endl;
    return 0;
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 日期类
```cpp
#include <iostream>
#include <string>
#include <cstring>
using namespace std;  

/*

main主函数 
c++程序以 .cpp 为文件扩展名  一个文件中 包含多个类和函数 
程序中 有且只有一个main函数 作为程序的入口  
c++程序从main函数开始执行 从上到下 从左到右 逐行执行

主函数中可以调用其他函数 其他函数不可以调用主函数

C++程序的源文件是 .cpp 文件 也叫源代码文件 文件中有多个类和函数
把.cpp文件编译成.out文件 

*/

 
class myDate 
{ 
    private: // 成员变量    private:写到第一行可以省略 因为默认就是私有的 学习阶段建议写上
        int year, month, day; 
    public: // 成员方法
        myDate(); // 声明构造函数 因为函数名和类名相同
        myDate(int, int, int); // 声明构造函数 重载（满足参数个数和类型不同）

        void setDate(int, int, int); // 声明成员函数
        void setDate(myDate); // 声明成员函数 重载

        myDate getDate(); 
        void setYear(int);
        int getMonth();
        void printDate() const; // 声明常成员函数 用const修饰函数 不能修改成员变量
}; // 注意类体结束 有分号


// 在类体外定义成员函数  需要加上 类名::函数名
myDate::myDate() 
{
    year = 1970;
    month = 1;
    day = 1;
}
myDate::myDate(int y, int m, int d) 
{
    year = y;
    month = m;
    day = d;
}
void myDate::setDate(int y, int m, int d) 
{
    year = y;
    month = m;
    day = d;
    return;
}
void myDate::setDate(myDate d) 
{
    year = d.year;
    month = d.month;
    day = d.day;
    return;
}
myDate myDate::getDate() 
{
    return *this;
}
void myDate::setYear(int y) 
{
    year = y;
    return;
}
int myDate::getMonth() 
{
    return month;
}
// 定义(实现)常成员函数    常成员函数不能修改属性值 一般用于输出打印信息就可以定义为常成员函数
void myDate::printDate() const 
{
    cout << year << "-" << month << "-" << day << endl;
    return;
}






// 定义一个学生类
class Student 
{
    private:
        string name; 
        int age;
    public:
        // 这是只有声明 没有定义具体的实现 在类体外定义
        void setStudent(string, int); // 设置姓名和年龄
        string getName(); // 获取姓名
        int getAge();  // 获取年龄
        void printStudent() const; // 打印信息
};


// 这句和上面的声明是一致的 包括参数列表 如果可以有不一致的情况 还需要弄懂为什么
void Student::setStudent(string s, int a) 
{
    // 为啥可以拿到name和age 
    // 虽然是类体外 本质上还是类的成员函数 自然可以访问类的成员变量
    // private 私有的 只能在类的内部访问 我这里也算 本类
    name = s;
    age = a; 
}
string Student::getName()
{
    return name;
}
int Student::getAge()
{
    return age;
}
void Student::printStudent() const 
{
    // name = s; age = a; 这是错的 常成员函数不能修改属性值 
    cout << "姓名：" << name << " \t年龄：" << age << endl;  
}
int main() 
{
    // 类型 变量名; 这和创建变量是一样的 就是把类实例化成对象 和java中 new 类名() 一样
    // 这里把类实例化对象 同样会调用构造函数
    myDate D; // 用类创建对象D 把类实例化成对象
    D.printDate(); // 调用对象的成员方法
    myDate d2(2020, 10, 1);
    d2.printDate();
    d2.setYear(2021);
    d2.printDate();
    Student s1; // 用类创建对象s1
    s1.setStudent("张三", 18);
    s1.printStudent();
    return 0;
}
```



```cpp
#include <cstring>
using namespace std;  // 有这句 才可以用 cout 不然要写成 std::cout


class myDate {
    // int year, month, day; 写到第一行可以省略 private 因为默认就是私有的
    private: // 成员变量
        int year, month, day; 
    public: // 成员方法
        myDate();
        myDate(int, int, int);
        void setDate(int, int, int);
        void setDate(myDate);
        myDate getDate();
        void setYear(int);
        int getMonth();
        void printDate() const; // 常成员函数 用const修饰函数 不能修改成员变量
};
// 在类体外定义成员函数
myDate::myDate() {
    year = 1970;
    month = 1;
    day = 1;
}
myDate::myDate(int y, int m, int d) {
    year = y;
    month = m;
    day = d;
}
void myDate::setDate(int y, int m, int d) {
    year = y;
    month = m;
    day = d;
    return;
}
void myDate::setDate(myDate d) {
    year = d.year;
    month = d.month;
    day = d.day;
    return;
}
myDate myDate::getDate() {
    return *this;
}
void myDate::setYear(int y) {
    year = y;
    return;
}
int myDate::getMonth() {
    return month;
}
// 常成员函数 不能修改属性值
void myDate::printDate() const {
    cout << year << "-" << month << "-" << day << endl;
    return;
}
class Student {
    private:
        string name; // 姓名
        int age; // 年龄
    public:
        // 这是只有声明 没有定义具体的实现 在类体外定义
        void setStudent(string, int); // 设置姓名和年龄
        string getName(); // 获取姓名
        int getAge();  // 获取年龄
        void printStudent() const; // 打印信息
};
void Student::setStudent(string s, int a) {
    // 这里name和age不懂是哪里来的
    name = s;
    age = a; 
}
string Student::getName() {
    return name;
}
int Student::getAge() {
    return age;
}
void Student::printStudent() const {
    // name = s; age = a; 这是错的 常成员函数不能修改属性值 
    cout << "姓名：" << name << " 年龄：" << age << endl;
}
int main() {
    myDate d1;
    d1.printDate();
    myDate d2(2020, 10, 1);
    d2.printDate();
    d2.setYear(2021);
    d2.printDate();
    Student s1;
    s1.setStudent("张三", 18);
    s1.printStudent();
    return 0;
}
```

## 构造函数和析构函数
```cpp
#include <iostream> 
using namespace std; 
#include <string>
 

class A
{
    private:
        int a, b;
    public:
        // 构造函数
        A(int k = 4, int j = 0) 
        {
            a = k;
            b = j;
        }
        // 析构函数
            
        void show();
};
void A::show()
{
    cout << "a = " << a << " b = " << b << endl;
}
A::~A()
{
    cout << "调用析构函数" << endl;
}
int main()
{ 
    A *p = new A(1);
    p->show();
    p->~A(); // 手动调用析构函数
    // delete p; // 自动调用析构函数
    return 0;
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 构造函数
```cpp
#include <iostream> 
using namespace std; 
#include <string>
 

class MyDate
{
    private:
        int year, month, day;
    public:
        MyDate();
        MyDate(int);
        MyDate(int, int);
        MyDate(int, int, int);
        // 内联函数
        void setDate(MyDate oneD)
        {
            year = oneD.year;
            month = oneD.month;
            day = oneD.day;
        }
        void printDate() const
        {
            cout << year << "-" << month << "-" << day << endl;
        }

};
// 不带参数
MyDate::MyDate()
{
    year = 2000;
    month = 1;
    day = 1;
}

//:year(2002), month(1) 是参数列表初始化   
MyDate::MyDate(int d):year(2002), month(1)
{
    day = d;
}
MyDate::MyDate(int m, int d):year(2003)
{
    month = m;
    day = d;
}
 
// 还可以这样写 MyDate::MyDate(int y, int m, int d):year(y), month(m), day(d){}
MyDate::MyDate(int y, int m, int d) 
{
    year = y;
    month = m;
    day = d;
}

class Student
{
    public: // 属性是公有的 为什么不放下面一起 属性和方法分开写也是一种规范
        string name;
        MyDate birthday; // 把上面的类 作为这里的类型
    public:
        Student();
        Student(string);
        void setStudent(string, MyDate);
        void setStudent(string);
        void setName(string);
        string getName();
        void setBirthday(MyDate);
        MyDate getBirthday();
        void printStudent() const;
};

// birthday(MyDate()) 的 MyDate() 没有名字的对象 创建了对象会调用默认的无参构造
Student::Student():name("Noname"), birthday(MyDate())
{};
Student::Student(string n):name(n), birthday(MyDate()) 
{};
void Student::setStudent(string n, MyDate d)
{
    name = n;
    birthday.setDate(d);
}
void Student::setStudent(string s)
{
    name = s;
    MyDate d;
    birthday.setDate(d);
    return;
}
void Student::setName(string n)
{
    name = n;
    return;
}
string Student::getName()
{
    return name;
}
void Student::setBirthday(MyDate d)
{
    birthday.setDate(d);
    return;
}
MyDate Student::getBirthday()
{
    return birthday;
}
 
void Student::printStudent() const
{
    cout << "姓名: " << name << " \t生日: ";
    birthday.printDate();
    cout << endl;
}
int main()
{
    MyDate d0;
    MyDate d1(25);
    MyDate(10, 25);
    MyDate(1970, 1, 12);
    MyDate birthday(1970, 1, 12);
    Student stud; // 类似 int a; 声明变量方式 创建了对象
    Student ss[2]; // 创建了对象数组 有2个对象
    int y, m, d, i;
    string name_;
    stud.printStudent();
    for (i = 0; i < 2; i++)
        ss[i].printStudent();
    for(i = 0; i < 2; i++)
    {
        cout << "请输入学生姓名生日 生日以 年 月 日 的次序输入";
        cin >> name_ >> y >> m >> d;
        ss[i].setStudent(name_, MyDate(y, m, d));
    }
    for (i = 0; i < 2; i++)
        ss[i].printStudent();
    return 0;
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 析构函数
```cpp
#include <iostream> 
using namespace std; 
#include <string>
 
 
class samp
{
    protected:
        int i, j;
    public:
        void setij(int a, int b)
        {
            i = a;
            j = b;
        }  
        ~samp()
        {
            cout << "析构函数被调用\n";
        }
        int getmuti()
        {
            return i * j;
        } 
}; 
int main()
{
    samp *p;
    p = new samp[5];
    if(!p)
    {
        cout << "内存分配错误\n";
        return 0;
    }
    for (int j = 0; j <= 5; j++)
    {
        p[j].setij(j, j);
    }
    for (int k = 0; k <= 5; k++)
    {
        cout << "muti[" << k << "]";
    }
    delete []p; // 会调用5次析构函数
    return 0;
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 静态变量
```cpp
#include <iostream> 
using namespace std; 
#include <string>

// 定义一个全局静态变量 
static int glos = 100;

void f()
{
    int a = 1;
    static int fs = 1;
    cout << "在f中： a（自动）=" << a << " fs（静态）=" << fs << " glos（全局静态）=" << glos << endl;
    a += 2;
    fs += 2;
    glos += 10;
    cout << "在f中： a（自动）=" << a << " fs（静态）=" << fs << " glos（全局静态）=" << glos << endl;
}
int main()
{ 
    static int ms = 10;
    for (int i = 1; i <= 3; i++)
    f();
    cout << "在main中： ms（静态）=" << ms << " glos（全局静态）=" << glos << endl;
    return 0;
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 静态成员的使用
```cpp
#include <iostream> 
using namespace std; 
#include <string>
 

class ClassA
{
    public:
        double x, y;
        // 用于记录通过构造函数创建的对象的个数
        static int num; // 类的静态成员 供所有对象共享  
        ClassA()
        {
            x = 0;
            y = 0;
            num++; // 每调用一次 num自增1
        }
        ClassA(double a, double b)
        {
            x = a;
            y = b;
            num++;
        }
        // 静态成员函数
        static void fn()
        {
            cout << "num = " << num << endl; // 静态成员函数只能访问静态成员
            // cout << "x = " << x << endl; // 报错 不能访问非静态成员
        }
};
// 使用类名限定符初始化静态成员变量
int ClassA::num = 0; // 静态成员变量初始化 只能在类体外初始化
int main()
{

    // 只会调用一次构造函数 因为 *p只是声明一个指针 并没有创建对象
    // ClassA *p;    p = new ClassA(2.1, 3.1); 才会调用构造函数
    ClassA obj(1.2, 3.4), *p; 
    // 注意这里访问num是用 类名限定符 ClassA::num 
    // 而不是js的类名.num 这样访问
    cout << "num为" << ClassA::num << endl;
    ClassA A[3]; // 声明一个对象数组 会调用3次构造函数
    cout << "num为" << ClassA::num << endl; // num又会自增3次
    ClassA::fn(); // 调用静态成员函数
    cout << endl;
    p = new ClassA(2.1, 3.1); // 调用1次构造函数
    cout << "num为" << ClassA::num << endl; // num又会自增1次
    ClassA::fn(); // 调用静态成员函数
    cout << "指针访问类的静态成员" << p->num << endl;
    p->fn(); // 通过指针访问类的静态成员函数
    return 0;
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```





## 变量的生命周期和作用域
```cpp
#include <iostream> 
using namespace std; 
#include <string>
 
  
int main()
{ 
    int i = 0;
    char ch = '2';
    cout << "i = " << i << endl;    
    cout << "ch = " << ch << endl;
    {
        if(i > 0)
        {
            double i = 20.3;
            int ch = 33;
            cout << "i=" << i << endl;
        }
        cout << "i = " << i << endl;
    }
    cout << "i = " << i << endl;
    return 0;
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```

## 常成员函数和普通成员函数的调用
```cpp
#include <iostream> 
using namespace std; 
#include <string>


class Sample
{
    public:
        Sample(); // 声明构造函数
        void getValueConst() const; // 声明常成员函数
        void getValue(); // 声明成员函数
        void printValue(); // 声明成员函数
        void printValueConst() const; // 声明常成员函数
};

// 定义构造函数
Sample::Sample(){}
// 定义常成员函数
void Sample::getValueConst() const
{
    cout << "常成员函数" << endl;
}
// 定义非常量成员函数
void Sample::getValue()
{
    cout << "非常量成员函数 " << endl;
}
// 定义非常量成员函数
void Sample::printValue()
{
    cout << "非常量成员函数" << endl;
}
// 定义常成员函数
void Sample::printValueConst() const
{
    cout << "常成员函数" << endl;
}
int main()
{
    const Sample obj1; // 常对象  obj1不能被修改
    Sample obj2; // 非常对象
    obj1.getValueConst(); // 常对象 调用 常成员函数
    // obj1.printValue(); // 常对象 不能调用 非常量成员函数

    obj2.printValue(); // 非常对象 调用 非常成员函数
    obj2.printValueConst(); // 非常对象 调用 常成员函数

    // 总结：
    // 常对象不能调用非常量成员函数 
    // 但是 非常对象 既可以调用常量成员函数 也可以调用非常量成员函数
    //  （一句话 ：常对象只能调用常量成员函数）其他没有限制
    return 0;

    // 常对象 只能调用 常成员函数 而 常成员函数 只能访问 常成员变量
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 类的常量成员和变量成员函数的使用
```cpp
#include <iostream> 
using namespace std; 
#include <string>


/*
    通过常量对象仅可以调用常量成员函数 
    是因为常量成员函数确保不会修改任何 非静态成员变量的值

    类的常量成员 必须在构造函数的初始化列表中进行初始化
*/

class constClass
{
    const int constNum;
    int num;
    public:
        constClass():constNum(0), num(100){} // 类的常量成员之能通过构造函数初始化列表进行初始化
        constClass(int i): constNum(i) 
        {
            num = 200;
        }
        void printConst()
        {
            cout << "constNum = " << constNum << endl;
            cout << "num = " << num << endl;
        }
        int getConst()
        {
            cout << "调用非常量函数" << endl;
            return constNum;
        } 
        int getConst() const 
        {
            cout << "调用常量函数" << endl;
            return constNum;
        } 
        int getValue()
        {
            return num;
        }
        void processConst()
        {
            cout << "在processConst函数中 非常量" << endl;
            int x = 2 * constNum + 1;
            cout << "x=" << x << endl;
            // constNum++; // 报错 不能修改常量成员
            num++;
            cout << "num=" << num << endl;
        }
        void processConst() const
        {
            cout << "在processConst函数中 常量" << endl;
            int x = constNum + 1;
            cout << "x=" << x << endl;
            // constNum++; // 报错 不能修改常量成员
            // num++; // 报错 常成员函数中不能修改非常量成员
            cout << "num=" << num << endl;
        }

};
 
int main()
{ 
    constClass obj1(123), obj2;
    obj1.printConst();
    cout << "obj2.getConst() = " << obj2.getConst() << endl;
    obj2.processConst();
    const constClass obj3(20);
    cout << "obj3.getConst() = " << obj3.getConst() << endl;
    obj3.processConst();
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```

## 封闭类的定义
```cpp
#include <iostream> 
using namespace std; 
#include <string>


/*
    封闭类就是 有一个嵌套的意思 一个类的成员是另一个类的对象 
*/

 

class A
{
    private:
        int radius, width;
    public:
        A():radius(16), width(185) {} // 构造函数
        A(int r, int w):radius(r), width(w) {} // 构造函数
        int getRadius()
        {
            return radius;
        }
        int getWidth()
        {
            return width;
        }
};


// 封闭类
class B
{
    private:
        int price;
        A a;  // 成员对象
    public:
        B();
        B(int p, int tr, int tw);
        int getPrice()
        {
            return price;
        } 
        A getA()
        {
            return a;
        }
};
B::B()
{
    price = 50010;
    A();
}
B::B(int p, int tr, int tw):price(p), a(tr, tw) {}


 
int main()
{
    B b(48900, 17, 225);
    cout << "price=" << b.getPrice() << endl;
    cout << "radius=" << b.getA().getRadius() << endl;
    cout << "A.width=" << b.getA().getWidth() << endl;
    B b1;
    cout << "price=" << b1.getPrice() << endl;
    cout << "radius=" << b1.getA().getRadius() << endl;
    cout << "a.width=" << b1.getA().getWidth() << endl;
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 封闭类的对象创建消亡
```cpp
#include <iostream> 
using namespace std; 
#include <string>
 

class A
{
    private:
        int radius, width;
    public:
        A():radius(16), width(185) { 
            cout << "内部类 构造函数" << endl;
        } // 构造函数
        A(int r, int w):radius(r), width(w) { 
            cout << "内部类 构造函数" << endl;
        } // 构造函数
        ~A()
        {
            cout << "内部类 析构函数" << endl;
        }
        int getRadius()
        {
            return radius;
        }
        int getWidth()
        {
            return width;
        }
};


// 封闭类
class B
{
    private:
        int price;
        A a;  // 成员对象
    public:
        B();
        B(int p, int tr, int tw);
        ~B();
        int getPrice()
        {
            return price;
        } 
        A getA()
        {
            return a;
        }
};
B::B()
{
    price = 50010;
    A();
    cout << "封闭类 构造函数" << endl;
}
B::B(int p, int tr, int tw):price(p), a(tr, tw)
{ 
    cout << "封闭类 构造函数" << endl;
}
B::~B()
{ 
    cout << "封闭类 析构函数" << endl;
} 


 
int main()
{
    B b(48900, 17, 225);
    cout << "price=" << b.getPrice() << endl;
    cout << "radius=" << b.getA().getRadius() << endl;
    cout << "width=" << b.getA().getWidth() << endl;
    B b1;
    cout << "price=" << b1.getPrice() << endl;
    cout << "radius=" << b1.getA().getRadius() << endl;
    cout << "width=" << b1.getA().getWidth() << endl;
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 友元函数
```cpp
#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>

class Pixel; // 前向引用声明
class Test
{
    public:
        void printX(Pixel p);
};
class Pixel
{
    private:
        int x, y;
    public: 
        Pixel(int x0, int y0)
        {
            x = x0;
            y = y0;
        }
        void printXY()
        {
            cout << "pixel: (" << x << "," << y <<")" <<endl;
        } 
        // 直接声明一个友元函数 这是一个全局函数 
        friend double getDist(Pixel p1, Pixel p2); 
        // 把Test类的成员函数printX 声明为本类的友元函数
        // 这意味着什么 意味着Test::printX 函数可以访问 本类的私有成员
        // 通过友元函数 实现了 外界的函数 可以访问本类的私有成员 这就是友元函数的功劳
        friend void Test::printX(Pixel p);
};
// 友元函数在类体外定义
double getDist(Pixel p1, Pixel p2)
{
    double x = p1.x - p2.x;
    double y = p1.y - p2.y;
    return sqrt(x*x + y*y);
}

void Test::printX(Pixel p)
{
    cout << "x=" << p.x << "\ty=" << p.y << endl;
    return;
}
int main()
{
    Pixel p1(0, 0), p2(10, 10);
    p1.printXY();
    p2.printXY();
    cout << "两点之间的距离为：" << getDist(p1, p2) << endl;
    Test t;
    cout << "从友元函数中输出 " << endl;
    t.printX(p1);
    t.printX(p2);
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 成员函数实现复数类
```cpp
// 2、现在设计复数类myComplex 类中的对象表示由实部real和虚部imag构成的复数。

// 类中实现复数的加法操作和复数的输出。为了对比分别以成员函数和友元函数实现:
// 【例3-15 类成员函数实现复数类操作(P131)】【例3-16 友元函数实现复数类操作(P132)】
// 3、友元类
// 友元类在被访问的类中的声明格式:friend〈类名>;友元类的关系是单向的，不能传递


#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>


class myComplex
{
    private:
        double real, imag;
    public:
        myComplex();
        myComplex(double r, double i);
        myComplex addCom(myComplex c);
        void outCom();
};
myComplex::myComplex()
{
    real = 0;
    imag = 0;
}
myComplex::myComplex(double r, double i)
{
    real = r;
    imag = i;
}
myComplex myComplex::addCom(myComplex c)
{
    // 返回一个对象 这里有点难理解
    // 直接调用构造函数 为什么会返回一个对象
    return myComplex(real + c.real, imag + c.imag);
}
void myComplex::outCom()
{
    cout << "(" << real << ", " << imag << ")" << endl;
}
int main()
{ 
    myComplex c1(1, 2), c2(3, 4), c3;
    c3 = c1.addCom(c2); // 通过成员函数必须通过类对象调用
    c1.outCom();
    cout << "+";
    c2.outCom();
    cout << "=";
    c3.outCom();
    cout << endl;
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 友元函数实现复数类
```cpp
// 友元函数实现复数类操作

#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>


class myComplex
{
    private:
        double real, imag;
    public:
        myComplex();
        myComplex(double r, double i);
        friend myComplex addCom(myComplex c1, myComplex c2);
        friend void outCom(myComplex c);
};
myComplex::myComplex()
{
    real = 0;
    imag = 0;
}
myComplex::myComplex(double r, double i)
{
    real = r;
    imag = i;
}
myComplex addCom(myComplex c1, myComplex c2) 
{
    // 返回一个对象 这里有点难理解
    // 直接调用构造函数 为什么会返回一个对象
    return myComplex(c1.real + c2.real, c1.imag + c2.imag);
}
void outCom(myComplex c)
{
    cout << "(" << c.real << ", " << c.imag << ")";
}
int main()
{ 
    myComplex c1(1, 2), c2(3, 4), c3;
    c3 = addCom(c1, c2); // 通过成员函数必须通过类对象调用
    outCom(c1);
    cout << "+";
    outCom(c2);
    cout << "=";
    outCom(c3);
    cout << endl;
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## this指针使用
```cpp
#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>


class myComplex
{
    private:
    public:
        double real, imag;
        myComplex(): real(0), imag(0) {}
        myComplex(double, double);
        myComplex AddRealOne();
        myComplex AddImagOne();
        void outCom(); // 成员函数 输出调用者对象的有关数据
};
myComplex::myComplex(double real, double imag)
{
    // this->real 是对象的成员变量 也就是上面类声明的real
    // real 是形参
    this->real = real;
    this->imag = imag;
} 
void myComplex::outCom()
{
    // 这里也可以用 this->real 为什么没用呢 应该没有产生歧义 如果有形参也叫real
    // 就需要用 this->real 表示是对象的成员变量
    cout << "(" << real << ", " << imag << ")";
}

myComplex myComplex::AddRealOne()
{
    this->real++;
    return *this; // 返回调用者对象本身    *this是对象 this是指针
}

myComplex myComplex::AddImagOne()
{
    this->imag++;
    return *this; // 返回调用者对象本身    *this是对象 this是指针
} 
int main()
{
    myComplex c1(1, 1), c2, c3;
    c1.outCom();
    c2.outCom();
    c3.outCom();
    cout << endl << "分界线" << endl;
    c2 = c1.AddRealOne();
    c1.outCom();
    c3 = c1.AddImagOne();
    c2.outCom();
    c3.outCom();
    cout << endl;
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```

## 派生类改变基类成员访问权限
```cpp
#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>

 
class BaseClass
{
    public: 
        int v1, v2;
        BaseClass()
        {
            v1 = 1; // 公有访问权限
            v2 = 1;
        }
        void temp1() {}  // 公有访问权限
};
class DerivedClass: public BaseClass
{
    int v1;
    void temp1() {} // 私有访问权限

    public:
        DerivedClass()
        {
            v1 = 10;
        }
        void printV()
        {
            cout << "v1=" << v1 << endl; // 子类的v1
            cout << "Base.v1=" << BaseClass::v1 << endl; // 基类的v1
        }
};
int main()
{ 
    BaseClass bc;
    DerivedClass dc;
    dc.printV();
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```

## 派生类继承
```cpp
#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>

class another;
class Base
{
    private:    
        float x;
    public:
        void print(const another &k);
};

class Derived: public Base
{
    private:
        float y;
};
class another
{
    private:
        int aaa;
    public:
        another()
        {
            aaa = 100;
        }
        // 基类的成员函数 声明为本类的友元函数
        friend void Base::print(const another &k);
};

void Base::print(const another &k)
{
    // 可以访问 私有成员变量
    cout << "Base: " << k.aaa << endl;
}
 
int main()
{
    Base a;
    Derived d;
    another ano;
    a.print(ano);
    d.print(ano);
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 公有继承
```cpp
#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>

// 公有继承



class Base
{
    public: 
        int vBPub;
    protected:
        int vBPro;
    private:
        int vBPri;

    // 基类的公有成员函数
    public:
        Base()
        {
            vBPub = 10;
            vBPro = 20;
            vBPri = 30;
        }
        void SetPriValue(int);
        void SetProValue(int, int);
        int GetPriValue();
        int GetProValue();
};
void Base::SetPriValue(int k)
{
    vBPri = k; // 直接访问基类的成员变量
}
void Base::SetProValue(int m, int n)
{
    vBPro = m; // 直接访问基类的成员变量、
    vBPri = n;
}
int Base::GetPriValue()
{
    return vBPri; // 访问基类的成员变量
}
int Base::GetProValue()
{
    return vBPro; // 访问基类的成员变量
}

class Derived: public Base // 子类  公有继承于Base类
{
    public: 
        int vDPub, vBPub;
    protected: 
        int vDPro;
    private:
        int vDPri;
    // 派生类的公有成员函数
    public:
        Derived()
        {
            vDPub = 100; // 直接访问派生类的成员变量
            vDPro = 200;
            vDPri = 300;
            vBPub = 15;
        }
        void SetPriValue(int);
        void SetProValue(int, int);
        int GetPriValue();
        int GetProValue();
        void PrintValue();
};
void Derived::SetPriValue(int k)
{ 
    vDPri = k; // 直接访问派生类的成员变量
}
void Derived::SetProValue(int m, int n)
{
    vDPro = m; // 直接访问派生类的成员变量
    vDPri = n;
    Base::vBPro = 2 * m; // 可以直接访问从基类继承的保护成员变量
    // Base::vBPri = 2 * n; // 不可以直接访问 从基类继承 的私有成员变量
}
int Derived::GetPriValue()
{
    return vDPri; // 访问派生类的成员变量
}
int Derived::GetProValue()
{
    return vDPro; // 访问派生类的成员变量
}

void Derived::PrintValue()
{ 
    cout << "访问父类公有变量: " << vBPub << endl;
    cout << "访问父类保护变量" << vBPro << endl;
    // cout << Base::vBPri << endl; // 不能直接访问基类的私有变量
    cout << "访问父类私有变量" << Base::GetPriValue() << endl;

    cout << "访问本类公有变量" << vDPub << endl;
    cout << "访问本类保护变量" << vDPro << endl;
    cout << "访问本类私有变量" << vDPri << endl;

    cout << "访问从父类继承的公有变量" << Base::vBPub << endl;
    cout << "访问从父类继承的保护变量" << Base::vBPro << endl;
    // cout << "访问从父类继承的私有变量" << Base::vBPri << endl;  // 不可以

 
}


 
int main()
{
    Base bObj;
    Derived dObj;

    cout << "基类的公有变量" << bObj.vBPub << endl;
    // cout << "基类的公有变量" << bObj.vBPro << endl;  不可以直接访问
    cout << "基类的公有变量" << bObj.GetProValue() << endl;
    cout << "基类的公有变量" << bObj.GetPriValue() << endl;

    cout << "派生类的公有变量" << dObj.vDPub << endl;
    // cout << "派生类的保护变量" << dObj.vDPro << endl; 不可以直接访问
    cout << "派生类的保护变量" << dObj.GetProValue() << endl;
    cout << "派生类的公有变量" << dObj.GetPriValue() << endl;
    cout << "派生类的私有变量" << dObj.Base::GetProValue() << endl;
    cout << "派生类的私有变量" << dObj.Base::GetPriValue() << endl;

    cout << dObj.vBPub << endl;
    cout << dObj.Base::vBPub << endl;

    dObj.PrintValue();
 
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 基类和派生类的构造函数和析构函数
```cpp
#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>

class BaseClass
{
    public:
        int v1, v2;
    BaseClass();
    BaseClass(int, int);
    ~BaseClass();
};
BaseClass::BaseClass()
{
    cout << "父类 无参构造" << endl;
}

BaseClass::BaseClass(int a, int b)
{
    cout << "父类 有参构造" << endl;
    v1 = a;
    v2 = b;
}
BaseClass::~BaseClass()
{
    cout << "父类 析构函数" << endl; 
}

// 公有继承的派生类
class DerivedClass: public BaseClass
{
    public:
        int v3;
    public:
        DerivedClass();
        DerivedClass(int);
        DerivedClass(int, int, int);
        ~DerivedClass(); 
};
DerivedClass::DerivedClass()
{
    cout << "子类 无参构造" << endl;
}

DerivedClass::DerivedClass(int k): v3(k)
{
    cout << "子类 带1个参的构造" << endl;
}
// 注意这里格式 
DerivedClass::DerivedClass(int m, int n, int k): BaseClass(m, n), v3(k)
{
    cout << "子类 带3个参的构造" << endl;
}
DerivedClass::~DerivedClass()
{
    cout << "子类 析构函数" << endl;
}
 
 
int main()
{ 
    cout << "无参对象创建" << endl;
    BaseClass baseClass;
    DerivedClass derivedCla;
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```





```cpp
#include <iostream> 
#include <cmath>
using namespace std; 
#include <string>


class point
{
    private:
        float x;
    public:
        void f(float a)
        {
            x = a;
        }
        void f()
        {
            x = 0;
        }
        friend float max(point &a, point &b);
};

float max(point &a, point &b)
{
    return a.x > b.x ? a.x : b.x;
}
 
int main()
{
    point a, b;
    a.f(2.2);
    b.f(3.3);
    cout << max(a, b) << endl;
    return 0; 
}
// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
```



## 内链
```cpp
/* 
    内联函数

    内联函数

    c++中 主程序 会经常调用外面的函数 
    为了避免 外面的函数调用和返回时 需要频繁的压栈出栈
    c++提供了内联函数
    内联函数用 空间换时间 
 */
#include <iostream> 
using namespace std;   
int main() 
{
    int a = 1;
    int &b = a; // b是a的引用
    const int &c = a; // c是a的常引用   
    b = 2; // a = 2 修改引用 等价于 修改原变量
    cout << "a = " << a << ", b = " << b << ", c = " << c << endl;
    // c = 3; // 错误，不能通过常引用去修改其引用的变量
    cout << "a = " << a << ", b = " << b << ", c = " << c << endl;
    return 0;
}


// 合适采用 inline定义的函数的情况是 D
// A 循环体含有循环语句
// B 函数体内含有递归语句
// C 函数代码量多 不常调用
// D 函数代码量少 且常调用     选D 这是内联函数的应用场景


// C++两种传参方式是 传值和传引用  


// endl的意思是   end 结束  l是line 行   结束一行的意思  换行



// 下面程序填空 输入为 590 


// #include <iostream>
// using namespace std;
// void func(int a, int ___, int ___)
// { cout << a << b << c << endl; }
// int main()
// {
//     func(5, 9);
//     return 0;
// }

// 解 （int a, int b, int c = 0）    c给一个默认参数 0
```

## 语言分类
1. 程序语言分为三类: 低级语言、中级语言、高级语言
2. 机器语言和汇编语言属于低级语言，直接能够操纵寄存器和内存
3. 



    1.机器语言依赖于CPU的指令系统，使用二进制代码编写程程序直接被机器识别。

    2.汇编语言使用助记符编写程序，是符号化了的机器语言，通用性差

    3.高级语言是面向用户的语言，通用性强，C++属于高级语言



## C和C++的关系
1. C++98为C++标准第一版
2. C语言是C++的前身
3.  c++是C的一个超集 C++进一步扩充和完善了C
4.  C++比C更安全
5. c++是一种编译式的、通用式、大小写敏感的编程语言，完全支持面向对象程序设计。
6. C和C++相比，在求解问题方法上进行最大的改进是——— 面向对象 （ C++新增面向对象）

    

## 编译原理
   1. windows环境下，c++源程序编译而成的目标文件的扩展名是 .obj (C++是编译型语言 和C一样 

    把.cpp文件 编译为 .obj文件 再把所有的 .obj文件 连接成 .exe文件）



## 什么是流
1. C++将 数据从一个对象流向另一个对象的流动 抽象称为 “流”，
2. 从流中获取数据的操作称为 提取操作
3. 从流中添加数据的操作称为 插入操作
4. cin 用来处理 标准输入 即 键盘输入

```cpp
cin >> 变量1 >> 变量2 >> endl;  
// 以 空格 tab enter 三种来分隔每个变量 
// 如果要输入这三种字符  可以使用 getchar()函数 转义
```

5. cout 用来处理 标准输出 即屏幕输出

```cpp
#include <iostream>
cout << 值1 << 值2 << endl;
```



## 常用头文件


## 命名空间
1. 所谓的命名空间namespace 是一种将程序库名称封装起来的方法 好处是 提高了程序的可靠性和性能 避免了同名引起的冲突

```cpp
// 标准的程序库命名空间
using namespace std;

// 引入其他命名空间标识符为   命名空间名::标识符名
```



## 数据类型与转换
1. srsr
2. 



# C++
## C++语言发展史
```cpp
1、程序语言分为三类:低级语言、中级语言、高级语言
机器语言和汇编语言属于低级语言，直接能够操纵寄存器和内存

    1.机器语言依赖于CPU的指令系统，使用二进制代码编写程程序直接被机器识别。
    2.汇编语言使用助记符编写程序，是符号化了的机器语言，通用性差
    3.高级语言是面向用户的语言，通用性强，C++属于高级语言
2、C和C++的关系

    C++98为C++标准第一版，
    C语言是C++的前身，
    c++是C的一个超集，
    进一步扩充和完善了C，
    C++比C更安全、

3、c++是一种编译式的、通用式、大小写敏感的编程语言，完全支持面向对象程序设计。
```

## c和c++的区别
```cpp
1、C++是C的超集，C++支持C的所有特性，但是C不支持C++的特性
2、C++支持面向对象编程，C不支持
3、C++支持函数重载，C不支持
4、C++支持引用，C不支持
5、C++支持默认参数，C不支持
6、C++支持命名空间，C不支持
7、C++支持异常处理，C不支持
8、C++支持类，C不支持

最大的区别 c++是面向对象 c是面向过程

windows环境下 由c++源程序文件编译而成的目标文件的扩展名为.obj

c++是一种编译式的语言，c++的编译过程和c语言一样 

把程序员编写的 .cpp 文件编译成 .obj 文件，然后再把所有的 .obj 文件连接成一个 .exe 文件

```

## C++语言的特点
```cpp
// 1. 基本的输入输出
//     C++将数据 从一个对象 流向 另一个对象 的流动过程 称为 "流"
//     从流中获取数据的操作 称为 提取操作
//     向流中添加数据的操作 称为 插入操作


//     输入流对象 cin
//     cin>>表达式1>>表达式2>>表达式n;
//     cin 用来处理标准输入，即键盘输入
//     连续从键盘读取想要的数据时 用>>运算符
//     以空格、Tab、回车作为分隔符，读取数据时，遇到分隔符就结束
//     但是 如果想要输入分隔符这三种 可以使用getchar()函数
//     类似于 转义字符

//     输出流对象 cout
//     cout<<表达式1<<表达式2<<表达式n;
//     cout用来处理标准输出，即屏幕输出
//     需要在程序中 包含头文件 #include <iostream>
//     <iostream>为标准的输入输出流

#include <iostream>
#include <string>
using namespace std; // 命名空间 避免命名冲突

// a::abc // 命名空间::变量名

int main()
{
    int oneInt1, oneInt2;
    char strArray[20];
    string str;
    double oneDouble;
    char oneChar = 'a';
    cout << "输入两个整型值，一个字符，一个字符串和一个浮点值，";
    cout << "以空格键 或 tab键 或 回车键分隔：" << endl;
    cin >> oneInt1 >> oneInt2 >> oneChar >> strArray >> oneDouble;
    str = strArray;
    cout << "输入的数据是：\t" << endl;
    cout << "两个整型值分别是：\t" << oneInt1 << "和" << oneInt2 << endl;
    cout << "字符是：\t" << oneChar << endl;
    cout << "字符串是：\t" << str << endl;
    cout << "浮点值是：\t" << oneDouble << endl;
    cout<<"Hello World!"<<endl;
    return 0;
}  
```

## 常用头文件
```cpp
#include <iostream> // 输入输出流
#include <fsteam> // 标准文件流
#include <string> // 标准字符串处理函数
#include <cmath> // 数学函数
```

## 命名空间
```cpp
using namespace std; // 标准程序库的命名空间 解决命名冲突

// 引入其他命名空间标识符为：命名空间名::标识符名
```

## 类型转换
```cpp
// 1 强制类型转换
格式: static_cast <类型名> 表达式 // static_cast是C++中的强制类型转换运算符 可以省略 
ontInt2 = int(oneDouble); // 强制类型转换 新语法
ontInt2 = (int)oneDouble; // 强制类型转换 旧语法


// 2 隐式类型转换 （自动类型转换）
// 小的类型可以自动转换为大的类型
char < int < float < double

// 3 去常量性
const_cast <类型名> (表达式)
用于去除指针与引用的常量性 但是不能去除变量的常量性 

单选题: 
例题1:【单选题】 若有以下类型标识符定义:char c='c';inta=4;float f=3.14;double d=1.212;则表达式c+a/(int)d+f的结果类型是( )
A. float
C. int
B. char
D. double
小类型自动转换为大类型，i强制类型优先转换、 Afloat

```



1. c++是c的超集，c++相对于c最大的改进是引入了面向对象的编程思想。
2. c是面向过程的编程思想，c++是面向对象的编程思想。
3. windows环境下，由c++源程序文件编译而成的目标文件的扩展名是.obj 
4. char c = 'c';  
int a = 4;  
float f = 3.14;  
double d = 1.212;  
则表达式 c + a / (int)d + f 的值是多少？类型是什么？  
 答：c + a / int(d) + f  
  = c + a / 1 + f     // int(d)是强制类型转换，将d转换为int类型 d为1 且是int类型  
  = c + 4 + 3.14      // 先算乘除 后加减  4/1 = 4    int / int = int  
  = 99 + 4 + 3.14     // c是char 和 int 相加  char会转换为int类型 c的ASCII码是99  
  = 103 + 3.14        // 99 + 4 = 103 int + int = int  
  = 106.14            // 103.00 + 3.14 = 106.14  最终是float类型  注意 类型的自动转换 小的类型自动转换为大的类型(这题非常重要 4+'c' 和js不一样)
5. c++的标准输入输出库为 iostream
6. c++的标准输入输出流对象为 cin 和 cout
7. c语言中 scanf命令在C++中改用：cin
8. c语言中 printf命令在C++中改用：cout << "hello world";
9. 指示编译器将一个源文件嵌入到另一个源文件中的命令是：#include
10. c++中一般的程序都要有2条语句，分别是：#include 和 using namespace std;
11. 下面程序输出 590 请补充程序

```cpp
#include <iostream>
using namespace std;
void func(int a, int ___, int ___)
{
   cout << a << b << c << endl;
}
void main()
{
   func(5, 9);
   return 0;
}
// void func(int a, int b, int c = 0)
```

12. 已知int *p = NULL 使用new为指针p申请一个存储大小为10的int型的空间，代码为_____

```cpp
int *p = NULL;
p = new int[10]; // 申请10个int类型的空间 赋值给指针p
```

13. String类的_____方法返回查找到字符串在主串的位置

```cpp
find
str.find("hello", 0); // 从0位置开始查找hello字符串
```

14. 在程序中定义了类 Point 并使用如下语句申请了一个Point类的对象数组。  
Point *ptr = new Point[2];   
则释放ptr指向的动态数组对象的语句是_____

```cpp
delete []ptr; // 释放ptr指向的动态数组对象
delete ptr[]; // 释放ptr指向的动态数组对象
```

15. new用来动态开辟空间，常用来产生动态数组及________

```cpp
指针
解析：使用new运算符分配的内存空间，可用数组和指针分配内存空间
```

16. 程序改错

```cpp
#include <iostream>
using namespace std;
int main()
{
   int *p = new int[10]; // 这里没问题 
   delete p; // delete []p
   return 0;
}
```

17. 类和对象不正确的选项  
A 类是一种类型 它封装了数据的操作  
B 对象是类的实例  
C 一个类的对象只有一个  // 错了 可以无数个  
D 一个对象必属于某个类
18. 不属于对象的特征是  
A 对象 // 排除法选这个   封装继承多态是最显著的特征  
B 封装  
C 继承  
D 多态
19. 对封装理解不正确的是  
A 通过封装 对象的全部属性和操作结合在一起 形成一个整体  
B 通过封装 一个对象的实现细节被尽可能的隐藏起来  
C 通过封装 每个对象都称为相对独立的个体  
D 通过封装 对象的属性都是不可见的   
答 D 有部分属性是可见的
20. 每个对象都是所属类的一个：实例
21. 面向对象中 一组对象的共同特征抽象出来形成：类
22. 面向对象中 通过封装实现数据隐藏的目的是：保护数据
23. 面向对象中 通过继承实现的目的是：代码复用
24. 面向对象中 通过多态实现的目的是：接口重用
25. 基类和派生类的关系称为 继承关系（不是父子关系 是继承关系）  
继承体现了类的层次关系
26. 下面程序的错误是什么

```cpp
#include <iostream>
using namespace std;
class Student
{
   int Num = 0; Score = 0;
   public:
      Student(int n, int s)
      {
         Num = n;
         Score = s;
      }
      void display()
      {
         cout << "Num:" << Num << endl;
         cout << "Score:" << Score << endl;
      }
}
void main() 
{
   Student student(1, 96);
   student.get();
}
// 类的成员变量必须在类的内部声明，不能在类的内部初始化  int Num, Score;
// 应该通过构造函数或成员函数进行初始化
```

27. 类和对象说法正确的是  
A 编辑器为每个类和对象分配内存空间  
B 类的对象具有成员函数的副本  
C 类的成员函数由类来调用  
D 编辑器为每个对象分配内存空间

答D   
解析: 类的定义不占内存 只有实例化后的对象占用内存  
只会给每个对象的成员变量分配内存 不会分配成员函数的空间  
普通成员函数由对象调用   
静态成员函数由类调用  
28. 若Test类中一个成员函数set的说明如下  
void set(Test &a); 则Test &a的含义是____  
A 指向类Test的名为a的指针  
B a是Test的对象引用，用来作函数set()的形参  
C 将a的地址赋给变量set   
D 变量Test与按位与的结果 作为函数set()的参数

答： B   
29. 下列成员函数的叙述正确的是  
A 成员函数必须在类体内完整定义  
B 成员函数可以在类体内声明，所以只能是内联函数  
C 成员函数必须在类体外定义  
D 成员函数可以在类体外定义  
答 D   
30. 下面是一个类的测试程序 请设计出

```cpp
int main()
{
   Test a;
   a.init(2019, 100);
   a.print();
   return 0;
}
// 执行结果为 2019-100=1949

#include <iostream>
using namespace std;
class Test 
{
   private:
      int year, month;
   public:
      void init(int y, int m)
      {
         year = y;
         month = m;
      }
      void print() 
      {
         cout << year << "-" << month << "=" << year - month << endl;
      }
}
```

31. 下面程序的补充完整

```cpp
#include <iostream>
using namespace std;
class book
{
   private:
      char num[8]; // 编号
      _____________; // 价格
   public:
      void set()
      {
         cin >> num >> price;
      }
      void display()
      {
         cout << "num:" << num << endl;
         cout << "price:" << price << endl;
      }
}
void main()
{
   book b;
   _________;
   b.display(); 
}
// double price;
// b.set();
```

32.对于下面定义的类myClass 在函数f()中将  
对象的成员变量a的值设置为50的语句是

```cpp
class myClass
{
   private:
      int n;
   public:
      myClass(int i)
      {
         n = i;
      }
      void setNum(int x)
      {
         n = x;
      }
      int f()
      {
         myClass *p = new myClass(10);
         ________________________;
      }
}
```

A p->setNum(50);  
B setNum(50);  
C p->n = 50;  
D *p->setNum(50);  
答案：A   
33. 

```cpp
class Test
{
   private:
      int a;
   public:
      int length;
      void set(int x)
      {
         a = x;
      }
}
int main()
{
   Test t;
   // 能拿到t不代表能拿到t的所有成员变量 得看修饰符
   // length是public的可以拿到
   t.length = 10;
   t.a = 10; // 错误 a是private的
   t.set(10);
   cout << t.a << endl;
   return 0;
}

```

22. 构造函数考题

```cpp
考题：
例题1:【单选题】以下有关构造函数的叙述中，错误的是
A.构造函数名必须和类名一致
B.构造函数在定义对象时自动执行
C.在一个类中构造函数有且仅有一个
D.构造函数可以在类体内声明，在类体外实现
答 C 
例题2:【单选题】声明一个没有初始化参数的对象需调用( )
A.指定参数构造函数
B.拷贝构造函数
C.初始化函数
D.默认构造函数
答 D 没有初始化参数 就是 没有加小括号
例题3:【单选题】构造函数不具备的特征是( )
A.构造函数的函数名与类名相同
C.构造函数可以设置默认参数
B.构造函数可以重载
D.构造函数必须指定返回类型
答 D 
例题4:【填空题】一个类拥有多个构造函数，则这些构造函数之间
为_--关系。
答 重载关系
例题5:【填空题】构造函数是类中特殊的成员函数，其功能是在_____时使用给定的值来初始化对象。
答 ：创建对象 或产生对象
例题6:【单选题】假定一个类的构造函数如下:
A(int k=4,int j=0){
    a=k; b=j;
}
则执行“ A  x(1); ”语句后，x.a和x.b的值分别是( )

A. 1和0
B.1和4
C.4和0
D.4和1
答 A
例题7:【单选题】AB是一个类，那么执行语句:AB a(4),b[3],*p;时，调用构造函数的次数为( )
A. 2.
C.4
B.3
D.5
答 C  *p 仅声明指针 没有用new对象 和对象没关系

例题8:【单选题】拷贝构造函数应该是
A.不带参数的构造函数
B.带有一个参数的构造函数
C.带有两个参数的构造函数
D.缺省构造函数
【正确答案:B】
【答案解析】:P101，复制构造函数只有一个参数，参数类型是本类的引用

例题9:【填空题】假如一个类的名称为MyClass，使用这个类的一个对象初始化该类的另一个对象时，可以调用____构造函数来完:成此功能。
答 复制构造函数

例题10:【填空题】复制构造函数的参数有些特别，这个参数是_____对象。
答  引用对象 引用类自己的
```

33. 析构函数

```cpp
例题1:【单选题】下列关于析构函数特征的描述中，正确的是( )
A.一个类中能定义一个析构函数 
B.析构函数名与类名不同
C.析构函数的定义只能在类体内
D.析构函数可以有一个或多个参数


答 A
析构函数虽然有～符号 但我们还是认为析构函数和类名是同名的
析构函数可以定义在类体外
析构函数没有参数

例题2:【单选题】下列关于类的析构函数的描述中，正确的是( )
A.能带形式参数X 
B.函数体中必须有delete语句
c.可以被重载 X
D.无形参，也不可重载

答D 
析构函数体中会有delete语句来释放空间 并不是必须的

例题3:【单选题】对类的构造函数和析构函数描述正确的是
A.构造函数可以重载，析构函数不能重载
B.构造函数不能重载，析构函数可以重载
C.构造函数可以重载，析构函数也可以重载
D.构造函数不能重载，析构函数也不能重载
答 A 
```

```cpp
#include <iostream>
using namespace std;
class A
{
   int a, b;
   public: 
      A()
      {
         a = b = 0;
      }
      A(int aa, int bb):a(aa), b(bb)
      {
         cout << "a=" << a << "\n" << "b=" << b << endl;
      }
      ~A()
      {
         cout << "析构" << endl;
      }
}
void main()
{
   A x, y(2, 3); // 创建了2个对象 x和y
}

// 输出结果
// a=2
// b=3
// 析构
// 析构

// 程序结束 对象销毁 所以会调用析构函数

例题5:【填空题】程序中撤销一个类的对象时，系统自动调用___
答 析构函数

例题6:【填空题】类Point的析构函数的定义原型是____
答 ~Point();
```

34. 类的静态成员

```javascript
例题1:【单选题】已知类A中的两个成员函数f1()和f2()，如果在f1()中不能直接调用f2()，
则下列选择中正确的是( )。
A.f1()和f2()都是静态函数
B.f1()不是静态函数,f2()是静态函数
C.f1()是静态函数,f2()不是静态函数
D.f1()和f2()都不是静态函数

答：C 
静态成员函数可以相互访问
非静态成员函数之间也可以相互访问
静态成员函数不能访问非静态成员函数


例题2:【单选题】下列关于静态成员函数的描述正确的是( )
A.静态成员变量是类的所有对象所共有的
B.静态成员变量要在构造函数内初始化
C.类的每个对象有自己的静态成员变量
D.静态成员变量不能通过类的对象访问

答：A 共有改为共享就更好了
静态成员必须在类体外初始化
所有对象共享类的静态成员变量
静态成员访问 3种 类名 对象名 指针

```

```cpp
// 补充完整 输出100
#include <iostream>
using namespace std;
class Test
{
   public:
      __________;
      Test(int i = 10)
      {
         x = i + x;
      }
      int Getnum()
      {
         return Text::x + 7;
      }
}
__________;
int main()
{
   Test test;
   cout << test.Getnum() << endl;
}

// static int x;
// int Test::x = 83;
```

38. 补充程序 输出结果为 x=6，y=10 x=11，y=10

```cpp
#include <iostream>
using namespace std;
class Sample
{
   private:
      int x; 
      _______;
   public:
      Sample(int a);
      void print();
};
Sample::Sample(____)
{
   x = a;
   y = x++;
}
void Sample::print()
{
   cout << "x=" << x << ", " << "y=" << y << endl;
}
int Sample::y = 25;
int main()
{
   Sample s1(5);
   Sample s2(10);
   s1.print();
   s2.print();
   return 0;
}
// static int y;
// int a

// 为什么y=10 因为y属于类的 全局共享当打印的时候 就变为第二次的赋值为 10 
```

39. 程序改错

```cpp
#include <iostream.h>
using namespace std;
class Point
{
   public:
      void init(){} // 注意函数体结尾不需要有分号 没有函数体就需要有分号 void init();
      static void output(){}
}
void main()
{
   Point P; // 创建一个对象P
   // 通过类名访问init 但init是非静态成员函数 
   Point::init(); // 所以要么这里改为 P.init(); 要么将init改为静态成员函数 static void init(); 
   P.output();
}

```

40. 程序改错

```cpp
#include <iostream>

using namespace std;
class Count
{
   static int count;
   public:
      Count()
      {
         count++;
      }
      static int Getc()
      {
         return count;  
      }
      ~Count()
      {
         count--;
      }
};
int Count::count = 5, obj; // 这种写法注意是可以的 给静态变量赋初值是固定格式 需要类名限定符和类型   obj是int类型 默认为0
int main()
{
   cout << obj.Getc() << endl; // 报错 0访问Getc()函数 肯定报错   没有对象可以改为 Count::Getc()
   return 0;
}
```

44. 这章没懂

```cpp
1 定义指向常量的指针p的选项是

A const int *p; // 指针所指数据为常量
B int * p;
C int * const p = &x;
D const int * const p = &x;
答 A

2 使用关键字const修饰的类的数据成员称为：
常成员变量 （只能通过构造函数的参数列表进行初始化）

```

44. 改正程序

```cpp
#include <iostream>
using namespace std;
class A
{
   int x;
   public:
      A(int a)
      {
         x = a;
      }
      void set(int a)
      {
         x = a;
      }
      void get()
      {
         cout << x << endl;
      }
}
int main()
{
   const A a(4); // 常量对象 只能调用 常成员函数    所以把const 取消掉
   a.set(6);
   a.get();
   a.set(10);
   a.get();
   return 0;
}
```

45. 程序改错

```cpp
#include <iostream>
void main()
{
   int x = 7;
   const int * p = &x; // const在*左边表示指针指向的数据为常量
   *p = 99; // *p表示数据  p表示指针   这里修改数据 是错误的
   cout << *p << endl;
}
```

```cpp
例题1:【单选题】 设类T将其他对象作为成员则创建类T的对象时，下列描述正确的是
A.先执行类T的构造函数
C.两者并行执行
B.先执行成员对象的构造函数
D.不能确定
【正确答案:B】
【答案解析】:P124，类T为封闭类，封闭类生成对象时，行执行所有成员对象的构造函数，然后执行封闭类的构造函数

例题2:【填空题】 若类X的对象x是类Y的成员对象，则执行”Y objc;”语句时，先调用类___的构造函数。
答 X

```

例题3:【程序编写题】定义一个生日类，数据成员有年、月、日。定义一个人员类，数据成员有姓名、性别、生日，人员类中的生日是生日类的对象，两个类都有构造函数和显示函数。在主函数中声明一个人员类对象，屏幕显示其数据。

```cpp

#include <iostream>
#include <string>
using namespace std; 
class Birthday
{
    private:
        string year;
        string month;
        string day; 
    public: 
        Birthday(string y, string m, string d);
        void show();

};
Birthday::Birthday(string y, string m, string d):year(y),month(m),day(d){}
void Birthday::show()
{
    cout << year << "-" << month << "-" << day << endl;
}
 
class Person
{ 
    private: 
        string name;
        string gender;
        Birthday birth; // 注意这里的写法 birth是个对象 但并没有()进行初始化
    public: 
        Person(string, string, string, string, string);
        void show();
};
 

// 注意这里才是 birth的初始化 birth(y, m, d)
Person::Person(string n, string g, string y, string m, string d):name(n),gender(g), birth(y, m, d){}
void Person::show()
{
    cout << "姓名：" << name << endl;
    cout << "性别: " << gender << endl;  
    cout << "生日: ";  
    birth.show();
}

int main()
{
    Person p("张三", "男", "1990", "10", "10");
    p.show();
    return 0;
}


// 在终端运行程序
// g++ -o 自定义文件名 复制的文件路径
// ./自定义文件名
   

```

```cpp

例题1:【单选题】 下列选项中不属于成员函数的是(
B.构造函数A.静态成员函数
C.友元函数
D.析构函数
【正确答案:C】
【答案解析】:P129，友元函数不是类的成员函数

例题2:【单选题】 下列选项中C++增加友元函数的目的是(
A.让其成为类的成员
C.能够访问类的私有成员
B.保证了数据的安全
D.破坏类访问的安全性
【正确答案:C】

例题3:【单选题】友员的作用之一是( )
A.提高程序的运行效率
B.增加类的封装
C.实现数据的隐藏性
D.增加成员函数的种类
【正确答案:A】

例题4:【填空题】在类City的定义中
加入语句”friend void Street::f();”，
是把_______类成员函数f()声明为了类City的友元函数。
答 Street
```

下面程序输出3.3 补充程序

```cpp

```



232. 【单选题】 下面关于友元的描述错误的是  
A.关键字friend用于声明友元  
B.一个类中的成员函数可以是另一个类的友元  
C.友元函数访问对象的成员不受访问特性影响  
D.友元函数通过this指针访问对象成员  
答 D



```cpp
#include <iostream>
using namespace std;

class CTest
{
   private: 
      int x;
   public:
      CTest(int x)
      {
         this->x = x;
      }
      ing getX()
      {
         return x;
      }
};

int main()
{
   const CTest obj(5); // 常对象
   cout << obj.getX() << endl; // 常对象只能访问常成员函数 这里访问的是 非常成员函数
   return 0;
}
// 修改 要么 去掉const 要么 把函数变为常成员函数
```

例题1:【单选题】在公有继承的情况下，基类成员在派生类中的  
访问权限( )  
A.受限制  
C.受保护  
B.保持不变  
D.不受保护  
答 B   
例题2:【单选题】下列对派生类的描述中，错误的是( )  
A.一个派生类可以作为另一个派生类的基类  
B.派生类至少有一个基类  
C.派生类的成员除了它自己的成员外，还包含了它的基类的成员  
D.派生类中继承的基类成员的访问权限到派生类保持不变

答 ：只有 公有继承 才保持不变

例题3:【填空题】派生类从基类保护继承时，基类的公有成员在派生类中改变为___成员。  
答 保护成员   protected成员

例题4:【填空题】在_____继承的情况下，基类数据成员在派生类中的访问权限保持不变。  
答 公有继承







```markdown
```cpp
#include <iostream>
using namespace std;


/*

    指针变量 数组 函数 配合使用
    
    

*/

// 冒泡排序函数
void bubbleSort(int * arr, int len) 
{
    // 形参1 是声明一个int指针变量
    // 形参2 是声明一个整int普通变量

    for (int i = 0; i < len - 1; i++)
    {
        for (int j = 0; j < len - 1 - i; j++)
        {
            if (arr[j] > arr[j + 1])
            {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

}

// 打印函数
void printArr(int * arr, int len) 
{
    for (int i = 0; i < 10; i++)
    {
        cout << arr[i] << " ";
    }
}

int main()
{
    // 创建一个数组
    int arr[10] = { 4,3,6,4,22,565,7,8,9,0 };
    // 数组的长度   数组名就是数组的首地址 arr是一个指针
    int len = sizeof(arr) / sizeof(arr[0]);

    // 调用冒泡排序函数
    bubbleSort(arr, len);

    // 打印排序后的数组
    printArr(arr, len); // 0 3 4 4 6 7 8 9 22 565 
}



// 结构体
https://www.bilibili.com/video/BV1et411b73Z?p=64&spm_id_from=pageDriver&vd_source=5e09d0a001ca43a605be940898fb2eef
```
```



## .cpp文件可以写什么？
```cpp
空白符
关键字
保留字
标识符
操作数
运算符
表达式
语句
基础数据类型（int bool 等等）
引用数据类型（类 对象 函数 数组 等等）
```





## 空白符
```cpp
// 空白符: 换行符 回车符 空格符 制表符 
// 作用: 增加阅读性
```

## 关键字
```cpp
// 关键字保留字: 被语言官方使用了 不能用作标识符

```

## 保留字
```cpp
// 关键字保留字: 被语言官方使用了 不能用作标识符

```

## 标识符
```cpp
// 标识符: C++标识符  由 字母 数字 下划线(_)组成    注意java新增了$符号

// 标识符命名规则
// 1 由字母、数字、下划线组成
// 2 不能以数字开头
// 3 不能是关键字
// 4 区分大小写

// 标识符命名规范
// 1 见名知意
// 大驼峰 小驼峰 
```

## 操作数
```cpp
// 操作数: 变量 常量 字面量 函数返回值
//  作用：方便程序员操作内存空间的符号

 
// 声明变量
int a; // 声明一个变量a
a = 2; // 给变量a赋值为2
int b = 1; // 声明一个变量b 并赋值为1

#define Day 7; // 定义一个宏常量
Day = 8; // 错误 常量不能修改

const int Month = 12; // const 修饰的变量是一个常量
Month = 13; // 错误  
```



## 运算符
```cpp
// 运算符
// 算术运算符 + - * / % ++ --
// 赋值运算符 = += -= *= /= %=
// 关系运算符 > < >= <= == !=
// 逻辑运算符 && || !
// 三目运算符 表达式1 ? 表达式2 : 表达式3
// 涉及1个操作数的 叫单目运算符 或 一元运算符
// 涉及2个操作数的 叫双目运算符 或 二元运算符
// 涉及3个操作数的 叫三目运算符 或 三元运算符


& 取地址符  &变量 取某个变量的地址
:: /* 作用域符  比如 std::cout << "hello"; */


// 算数运算符
// + 加法
// - 减法
// * 乘法
// / 除法
// % 取余
// ++ 自增
// -- 自减

// 关系运算符 
// > 大于
// >= 大于等于
// < 小于
// <= 小于等于
// == 等于
// != 不等于
// instanceof 「判断对象是否是某个类的实例」  对象 instanceof 类名  
// :: 作用域运算符  「表示方法是这个类的」   类::方法名 

// 逻辑运算符

// && 逻辑与
// || 逻辑或
// ! 逻辑非

// 位运算符 
// & | ^ ~ << >> >>>

// 赋值运算符 
// = 赋值运算符
// += 加等于
// -= 减等于
// *= 乘等于
// /= 除等于
// %= 取余等于 



// ? : 三目运算符
// . 成员访问运算符
// -> 指向成员运算符
// () 方法调用运算符 函数调用运算符 括号运算符
// new 内存分配运算符
// delete 取消内存分配运算符
// [] 下标运算符
// [] 下标运算符
// throw 抛出异常运算符
// , 逗号运算符

// 运算符优先级 

// &变量;   取地址运算符& 把变量的地址取出来
```

## 表达式
```cpp

```

## 语句
```cpp

比如说 注释语句 流程控制语句（顺序 分支 循环） 输入输出语句 
1注释语句： // 单行注释  /* 多行注释 */   自定规范 统一使用多行注释 c++ 暂时没发现文档注释

  2 输入输出语句  必须要有头文件 #include <iostream>
  cout << "hello" << endl; // 输出hello 并换行 
  int a = 1;
  cout << "a = " << a << endl; // 输出a = 1
  cin >> a; // 输入一个整数 并赋值给a
  cout << "a = " << a << endl; // 输出a = 输入的整数

  3 三种流程控制语句
  顺序 选择 循环
  
if (true) {

}
if(true) {
    // 条件为真执行
} else {
    // 条件为假执行
}
if (true) {
    // 条件为真执行
} else if (true) {
    // 条件为真执行
} else {
    // 条件为假执行
}
// switch语句
switch (表达式) {
    case 常量1:
        // 语句
        break;
    case 常量2:
        // 语句
        break;
    default:
        // 语句
        break;
}

// while循环
while (条件) {
    // 循环体
}
// do-while循环
do {
    // 循环体
} while (条件);

// for循环
for (初始化表达式; 条件表达式; 步进表达式) {
    // 循环体
}

break; // break语句 结束当前循环
continue; // continue语句 结束本次循环
return 值; // return语句 结束函数
goto 标签; // goto语句 跳转到标签
// 解释:如果标记的名称存在，执行到goto语句时，会跳转到标记的位置

```

## 基础数据类型
```cpp
// 学完操作数 就要学习数据类型

// 基础数据类型： 整型 浮点型 字符型 布尔型
//    4类8种： short int long long long   float double  char bool

// 复合数据类型： 数组类型 结构体类型 枚举类型 指针类型 引用类型




// C++规定 创建变量时 必须明确数据类型 否则无法分配内存  
// 数据类型存在的意义就是给变量分配合适的内存空间

// 1 整型 
// short 2字节 短整型
// int 4字节 整型
// long 4字节 长整型
// long long 8字节 长长整型

// sizeof() 函数 可以查看数据类型所占内存大小
sizeof(数据类型｜变量) // 返回数据类型所占内存大小

int a = 1;
sizeof(a); // 返回4 

sizeof(int); // 4
sizeof(short); // 2
sizeof(long); // 4
sizeof(long long); // 8


// 2 浮点型
// float 4字节 单精度浮点型
// double 8字节 双精度浮点型

float f = 1.1F; // F是float类型的后缀
double d = 1.1; // 默认是double类型

sizeof(float); // 4
sizeof(double); // 8


// 3 字符型
// char 1字节 字符型    作用：存放单个字符

// 声明一个字符变量
char c = 'a';  // 把字符对应的ASCII码存储到变量中
sizeof(char); // 1
char d = "s"; // 错误  只能是单引号
char e = 'ab'; // 错误  字符型变量只能存储一个字符
// 转义字符
char f = '\n'; // 换行符
char g = '\t'; // 制表符
char h = '\r'; // 回车符

// 4 字符串型
string str = "hello"; // 必须添加头文件 #include <string>
char str[] = "hello"; // 字符数组 C语言风格的字符串

// 5 布尔型
// bool 1字节 布尔型
bool flag = true; // true 1 false 0
bool flag2 = false;
sizeof(bool); // 1 占1个字节



```

## 引用数据类型
```cpp
类 对象 函数 数组 
```

###  
