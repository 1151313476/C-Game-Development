#include "bullet.h"

void Bullet::Draw() const
{
    // �����ӵ���ɫ
    setlinecolor(RGB(255, 155, 50));
    setfillcolor(RGB(200, 75, 10));

    // ����ʵ��Բ
    fillcircle(position.x, position.y, RADIUS);
}
