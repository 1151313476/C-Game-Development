#pragma once
#include "button.h"
#include "globals.h"

// ��ʼ��Ϸ��ť
class StartGameButton : public Button
{
public:
    StartGameButton(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed);
    ~StartGameButton() = default;

protected:
    void OnClick() override;
};

// �˳���Ϸ��ť
class QuitGameButton : public Button
{
public:
    QuitGameButton(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed);
    ~QuitGameButton() = default;

protected:
    void OnClick() override;
};
