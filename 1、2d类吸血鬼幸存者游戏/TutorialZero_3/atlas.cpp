#include "atlas.h"

Atlas::Atlas(LPCTSTR path, int num)
{
    TCHAR path_file[256];
    for (size_t i = 0; i < num; i++)
    {
        // 格式化文件路径
        _stprintf_s(path_file, path, i);

        // 创建并加载图像
        IMAGE* frame = new IMAGE();
        loadimage(frame, path_file);

        // 添加到帧列表
        frame_list.push_back(frame);
    }
}

Atlas::~Atlas()
{
    // 释放所有帧资源
    for (auto frame : frame_list)
    {
        delete frame;
    }
    frame_list.clear();
}
