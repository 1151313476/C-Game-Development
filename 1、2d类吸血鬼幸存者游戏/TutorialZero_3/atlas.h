#pragma once
#include "graphics_utils.h"

// ͼ���࣬��������֡������ͼƬ��Դ
class Atlas
{
public:
    Atlas(LPCTSTR path, int num);
    ~Atlas();

    // �洢����֡������
    std::vector<IMAGE*> frame_list;
};
