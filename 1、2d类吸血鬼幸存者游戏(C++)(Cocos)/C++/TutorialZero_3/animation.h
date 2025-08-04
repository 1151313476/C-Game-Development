#pragma once
#include "atlas.h"

// 动画类，管理帧动画的播放
class Animation
{
public:
    Animation(Atlas* atlas, int interval);
    ~Animation() = default;

    // 播放动画
    void Play(int x, int y, int delta);

private:
    int timer = 0;          // 计时器
    int idx_frame = 0;      // 当前帧索引
    int interval_ms = 0;    // 帧间隔(毫秒)
    Atlas* anim_atlas = nullptr; // 关联的图集
};
