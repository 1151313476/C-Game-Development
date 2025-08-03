#pragma once
#include "animation.h"
#include "globals.h"

// 玩家角色类
class Player
{
public:
    // 角色尺寸
    static const int FRAME_WIDTH = 80;
    static const int FRAME_HEIGHT = 80;

    Player();
    ~Player();

    // 处理输入事件
    void ProcessEvent(const ExMessage& msg);

    // 移动逻辑
    void Move();

    // 绘制角色
    void Draw(int delta);

    // 获取位置
    const POINT& GetPosition() const;

private:
    // 移动速度
    static const int SPEED = 3;

    // 阴影尺寸
    static const int SHADOW_WIDTH = 32;

    // 阴影图像
    IMAGE img_shadow;

    // 动画组件
    Animation* anim_left;
    Animation* anim_right;

    // 位置
    POINT position = { 500, 500 };

    // 移动状态
    bool is_move_up = false;
    bool is_move_down = false;
    bool is_move_left = false;
    bool is_move_right = false;
};
