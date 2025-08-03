#pragma once
#include "animation.h"
#include "globals.h"

// ��ҽ�ɫ��
class Player
{
public:
    // ��ɫ�ߴ�
    static const int FRAME_WIDTH = 80;
    static const int FRAME_HEIGHT = 80;

    Player();
    ~Player();

    // ���������¼�
    void ProcessEvent(const ExMessage& msg);

    // �ƶ��߼�
    void Move();

    // ���ƽ�ɫ
    void Draw(int delta);

    // ��ȡλ��
    const POINT& GetPosition() const;

private:
    // �ƶ��ٶ�
    static const int SPEED = 3;

    // ��Ӱ�ߴ�
    static const int SHADOW_WIDTH = 32;

    // ��Ӱͼ��
    IMAGE img_shadow;

    // �������
    Animation* anim_left;
    Animation* anim_right;

    // λ��
    POINT position = { 500, 500 };

    // �ƶ�״̬
    bool is_move_up = false;
    bool is_move_down = false;
    bool is_move_left = false;
    bool is_move_right = false;
};
