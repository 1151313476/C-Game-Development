#pragma once
#include <graphics.h>

// �ӵ���
class Bullet
{
public:
    // λ��
    POINT position = { 0, 0 };

    // ����/����
    Bullet() = default;
    ~Bullet() = default;

    // �����ӵ�
    void Draw() const;

private:
    // �ӵ��뾶
    static const int RADIUS = 10;
};
