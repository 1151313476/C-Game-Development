#pragma once
#include "player.h"
#include "animation.h"
#include "globals.h"
#include "bullet.h"

// ������
class Enemy
{
public:
    Enemy();
    ~Enemy();

    // ����ӵ���ײ
    bool CheckBulletCollision(const Bullet& bullet);

    // ��������ײ
    bool CheckPlayerCollision(const Player& player);

    // �ƶ��߼�
    void Move(const Player& player);

    // ���Ƶ���
    void Draw(int delta);

    // ���˴���
    void Hurt();

    // ����Ƿ���
    bool CheckAlive();

private:
    // �ƶ��ٶ�
    static const int SPEED = 2;

    // ���˳ߴ�
    static const int FRAME_WIDTH = 80;
    static const int FRAME_HEIGHT = 80;

    // ��Ӱ�ߴ�
    static const int SHADOW_WIDTH = 48;

    // ��Ӱͼ��
    IMAGE img_shadow;

    // �������
    Animation* anim_left;
    Animation* anim_right;

    // λ��
    POINT position = { 0, 0 };

    // ����
    bool facing_left = false;

    // ���״̬
    bool alive = true;
};
