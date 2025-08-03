#pragma once
#include <graphics.h>

// ��ť����
class Button
{
public:
    Button(RECT rect, LPCTSTR path_img_idle, LPCTSTR path_img_hovered, LPCTSTR path_img_pushed);
    virtual ~Button() = default;

    // �����¼�
    void ProcessEvent(const ExMessage& msg);

    // ���ư�ť
    void Draw();

protected:
    // ����¼�(������ʵ��)
    virtual void OnClick() = 0;

private:
    // ��ť״̬
    enum class Status { Idle = 0, Hovered, Pushed };

    RECT region;            // ��ť����
    IMAGE img_idle;         // Ĭ��״̬ͼ��
    IMAGE img_hovered;      // ��ͣ״̬ͼ��
    IMAGE img_pushed;       // ����״̬ͼ��
    Status status = Status::Idle; // ��ǰ״̬

    // �������Ƿ��ڰ�ť������
    bool CheckCursorHit(int x, int y);
};
