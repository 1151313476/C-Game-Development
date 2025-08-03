#include "game_buttons.h"

StartGameButton::StartGameButton(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed)
    : Button(rect, path_img_idle, path_img_hovered, path_img_pushed)
{
}

void StartGameButton::OnClick()
{
    // 设置游戏开始标志
    g_isGameStarted = true;

    // 播放背景音乐
    mciSendString(_T("play bgm repeat from 0"), NULL, 0, NULL);
}

QuitGameButton::QuitGameButton(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed)
    : Button(rect, path_img_idle, path_img_hovered, path_img_pushed)
{
}

void QuitGameButton::OnClick()
{
    // 设置游戏结束标志
    g_running = false;
}
