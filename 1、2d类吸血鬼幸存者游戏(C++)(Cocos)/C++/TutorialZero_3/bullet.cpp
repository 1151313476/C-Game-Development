#include "bullet.h"

void Bullet::Draw() const
{
    // 设置子弹颜色
    setlinecolor(RGB(255, 155, 50));
    setfillcolor(RGB(200, 75, 10));

    // 绘制实心圆
    fillcircle(position.x, position.y, RADIUS);
}
