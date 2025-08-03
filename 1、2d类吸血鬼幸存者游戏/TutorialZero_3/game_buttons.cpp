#include "game_buttons.h"

StartGameButton::StartGameButton(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed)
    : Button(rect, path_img_idle, path_img_hovered, path_img_pushed)
{
}

void StartGameButton::OnClick()
{
    // ������Ϸ��ʼ��־
    g_isGameStarted = true;

    // ���ű�������
    mciSendString(_T("play bgm repeat from 0"), NULL, 0, NULL);
}

QuitGameButton::QuitGameButton(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed)
    : Button(rect, path_img_idle, path_img_hovered, path_img_pushed)
{
}

void QuitGameButton::OnClick()
{
    // ������Ϸ������־
    g_running = false;
}
