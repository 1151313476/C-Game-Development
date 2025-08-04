#pragma once
#include <graphics.h>

// 子弹类
class Bullet
{
public:
    // 位置
    POINT position = { 0, 0 };

    // 构造/析构
    Bullet() = default;
    ~Bullet() = default;

    // 绘制子弹
    void Draw() const;

private:
    // 子弹半径
    static const int RADIUS = 10;
};
