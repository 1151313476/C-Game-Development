# 2D类吸血鬼幸存者游戏

基于 **Cocos Creator** 引擎开发的2D生存游戏，使用 **TypeScript** 语言编写。

## 项目结构

```
assets/
├── Script/               # TypeScript脚本文件
│   ├── Player.ts         # 玩家控制脚本
│   ├── Enemy.ts          # 敌人类脚本
│   ├── Bullets.ts        # 子弹系统脚本
│   ├── EnemyManager.ts   # 敌人生成管理
│   └── MainScene_GameManager.ts # 游戏管理脚本
├── Scene/                # 场景文件
│   ├── GameScene.scene   # 游戏场景
│   └── MainScene.scene   # 主菜单场景
├── Prefab/               # 预制体资源
│   ├── Player.prefab     # 玩家预制体
│   ├── Enemy.prefab      # 敌人预制体
│   └── Bullet.prefab     # 子弹预制体
├── Animation_Clip/       # 动画片段
│   ├── player_left.anim  # 玩家左移动画
│   └── player_right.anim # 玩家右移动画
├── Sprite_Atlas/         # 精灵图集
│   ├── player_left/      # 玩家左移动画帧
│   └── player_right/     # 玩家右移动画帧
├── img/                  # 图像资源
│   ├── player_*.png      # 玩家动画帧
│   ├── enemy_*.png       # 敌人动画帧
│   ├── ui_*.png          # UI按钮图片
│   ├── background.png    # 背景图片
│   └── menu.png          # 菜单图片
└── mus/                  # 音频资源
    ├── bgm.mp3          # 背景音乐
    └── hit.wav          # 击中音效
```

## 核心功能

- **玩家控制**: 方向键移动，自动环绕子弹攻击
- **敌人生成**: 屏幕边界随机生成敌人
- **碰撞检测**: 基于物理引擎的碰撞判定
- **得分系统**: 消灭敌人获得分数
- **UI界面**: 开始/退出按钮交互

## 开发设计架构

### 核心组件设计
```
Component System (组件系统)
├── Player (玩家组件)
│   ├── 方向键移动控制
│   ├── 边界检测
│   ├── 动画状态管理
│   └── 碰撞检测
├── Enemy (敌人组件)
│   ├── AI移动逻辑
│   ├── 碰撞检测
│   ├── 生命值管理
│   └── 自动寻路算法
└── Bullets (子弹组件)
    ├── 环绕运动算法
    ├── 攻击判定
    └── 三角函数计算

Physics System (物理系统)
├── Collider2D (碰撞器)
├── RigidBody2D (刚体)
└── PhysicsSystem2D (物理系统)

Animation System (动画系统)
├── Animation (动画组件)
├── AnimationClip (动画片段)
└── SpriteAtlas (精灵图集)

Scene System (场景系统)
├── GameScene (游戏场景)
└── MainScene (主菜单场景)

Prefab System (预制体系统)
├── Player Prefab (玩家预制体)
├── Enemy Prefab (敌人预制体)
└── Bullet Prefab (子弹预制体)
```

## 编译运行

使用 Cocos Creator 打开项目，点击运行即可。

## 游戏玩法

控制角色躲避敌人，依靠自动环绕的子弹系统消灭敌人获得分数。被敌人触碰时游戏结束。 