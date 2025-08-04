#pragma once
#include "graphics_utils.h"

// 图集类，管理序列帧动画的图片资源
class Atlas
{
public:
    Atlas(LPCTSTR path, int num);
    ~Atlas();

    // 存储所有帧的容器
    std::vector<IMAGE*> frame_list;
};
