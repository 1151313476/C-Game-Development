# 2D类吸血鬼幸存者游戏

基于 **EasyX图形库** 开发的2D生存游戏，使用 **C++** 语言编写。

## 项目结构

```
TutorialZero_3/
├── main.cpp              # 主程序入口
├── globals.h/cpp         # 全局变量和常量
├── graphics_utils.h      # 图形工具函数
├── atlas.h/cpp           # 图集管理类
├── animation.h/cpp       # 动画播放类
├── player.h/cpp          # 玩家类
├── enemy.h/cpp           # 敌人类
├── bullet.h/cpp          # 子弹类
├── button.h/cpp          # 按钮基类
├── game_buttons.h/cpp    # 游戏按钮类
├── game_utils.h/cpp      # 游戏工具函数
├── img/                  # 图像资源
│   ├── player_*.png      # 玩家动画帧
│   ├── enemy_*.png       # 敌人动画帧
│   ├── ui_*.png          # UI按钮图片
│   ├── background.png    # 背景图片
│   └── menu.png          # 菜单图片
├── mus/                  # 音频资源
│   ├── bgm.mp3          # 背景音乐
│   └── hit.wav          # 击中音效
└── x64/Debug/           # 编译输出目录
```

## 核心功能

- **玩家控制**: WASD键移动，自动环绕子弹攻击
- **敌人生成**: 屏幕边界随机生成敌人
- **碰撞检测**: 玩家与敌人的碰撞判定
- **得分系统**: 消灭敌人获得分数
- **UI界面**: 开始/退出按钮交互

## 开发设计架构

### 核心类设计
```
Atlas (图集管理)
├── 加载和管理动画帧资源
├── 提供帧图像访问接口
└── 内存资源管理

Animation (动画播放)
├── 基于Atlas的【帧动画】控制
├── 定时器控制播放速度
├── 自动循环播放
└── 帧同步控制

GameObject (游戏对象基类)
├── Player (玩家类)
│   ├── WASD移动控制
│   ├── 边界检测
│   ├── 动画状态管理
│   └── 碰撞检测
├── Enemy (敌人类)
│   ├── AI移动逻辑
│   ├── 碰撞检测
│   ├── 生命值管理
│   └── 自动寻路算法
└── Bullet (子弹类)
    ├── 环绕运动算法
    ├── 攻击判定
    └── 三角函数计算

UI System (界面系统)
├── Button (按钮基类)
├── StartGameButton (开始按钮)
└── QuitGameButton (退出按钮)
```



## 编译运行

使用 Visual Studio 打开 `TutorialZero_3.sln` 项目文件，编译运行即可。

## 游戏玩法

控制角色躲避敌人，依靠自动环绕的子弹系统消灭敌人获得分数。被敌人触碰时游戏结束。
