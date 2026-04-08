


```sh

######################## 设备管理命令 #######################
# 查看连接的设备
adb devices

# 连接到网络设备 
adb connect HOST[:PORT] # 比如 adb connect 192.168.1.100:5555

# 断开设备
adb disconnect

# 重启设备 类似于手动关闭机顶盒 再打开 
adb reboot


######################## 屏幕和输入命令 #######################
# 截图
# 进行截图 可能有警告但不影响
adb shell screencap -p /sdcard/iptv_screenshot1.png 
# 把截图 拉去到 本机 /Users/elpis/workspace/img可替换为希望存储的目录
adb pull /sdcard/iptv_screenshot1.png /Users/elpis/workspace/img


# 录屏
adb shell screenrecord /sdcard/demo.mp4

# 模拟按键
adb shell input keyevent KEYCODE_HOME

# 模拟点击
adb shell input tap 500 500

# 模拟滑动
adb shell input swipe 300 1000 300 500

######################## 调试和开发命令 #######################
# 进入设备shell
adb shell

# 查看当前Activity
adb shell dumpsys activity | grep "mResumedActivity"

# 查看CPU使用情况
adb shell dumpsys cpuinfo

# 查看内存使用情况
adb shell dumpsys meminfo
```