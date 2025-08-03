#pragma once
#include <graphics.h>

// 按钮基类
class Button
{
public:
    Button(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed);
    virtual ~Button() = default;

    // 处理事件
    void ProcessEvent(const ExMessage& msg);

    // 绘制按钮
    void Draw();

protected:
    // 点击事件(由子类实现)
    virtual void OnClick() = 0;

private:
    // 按钮状态
    enum class Status { Idle = 0, Hovered, Pushed };

    RECT region;            // 按钮区域
    IMAGE img_idle;         // 默认状态图像
    IMAGE img_hovered;      // 悬停状态图像
    IMAGE img_pushed;       // 按下状态图像
    Status status = Status::Idle; // 当前状态

    // 检查鼠标是否在按钮区域内
    bool CheckCursorHit(int x, int y);
};
