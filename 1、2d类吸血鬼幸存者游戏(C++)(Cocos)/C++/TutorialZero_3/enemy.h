#pragma once
#include "player.h"
#include "animation.h"
#include "globals.h"
#include "bullet.h"

// 敌人类
class Enemy
{
public:
    Enemy();
    ~Enemy();

    // 检查子弹碰撞
    bool CheckBulletCollision(const Bullet& bullet);

    // 检查玩家碰撞
    bool CheckPlayerCollision(const Player& player);

    // 移动逻辑
    void Move(const Player& player);

    // 绘制敌人
    void Draw(int delta);

    // 受伤处理
    void Hurt();

    // 检查是否存活
    bool CheckAlive();

private:
    // 移动速度
    static const int SPEED = 2;

    // 敌人尺寸
    static const int FRAME_WIDTH = 80;
    static const int FRAME_HEIGHT = 80;

    // 阴影尺寸
    static const int SHADOW_WIDTH = 48;

    // 阴影图像
    IMAGE img_shadow;

    // 动画组件
    Animation* anim_left;
    Animation* anim_right;

    // 位置
    POINT position = { 0, 0 };

    // 朝向
    bool facing_left = false;

    // 存活状态
    bool alive = true;
};
