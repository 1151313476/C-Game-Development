#pragma once
#include "atlas.h"

// �����࣬����֡�����Ĳ���
class Animation
{
public:
    Animation(Atlas* atlas, int interval);
    ~Animation() = default;

    // ���Ŷ���
    void Play(int x, int y, int delta);

private:
    int timer = 0;          // ��ʱ��
    int idx_frame = 0;      // ��ǰ֡����
    int interval_ms = 0;    // ֡���(����)
    Atlas* anim_atlas = nullptr; // ������ͼ��
};
