#include "game_utils.h"
#include "globals.h"

void TryGenerateEnemy(std::vector<Enemy*>& enemy_list)
{
    static int counter = 0;

    // ÿ100֡����һ������
    if ((++counter) % 100 == 0)
        enemy_list.push_back(new Enemy());
}

void UpdateBullets(std::vector<Bullet>& bullet_list, const Player& player)
{
    const double RADIAL_SPEED = 0.0045;      // �����˶��ٶ�
    const double TANGENT_SPEED = 0.0055;    // �����˶��ٶ�

    // �����ӵ���Ļ��ȼ��
    double radian_interval = 2 * 3.14159 / bullet_list.size();

    // ��ȡ���λ��
    POINT player_position = player.GetPosition();

    // ���㵱ǰ�뾶(������Ч��)
    double radius = 100 + 25 * sin(GetTickCount() * RADIAL_SPEED);

    // ����ÿ���ӵ�λ��
    for (size_t i = 0; i < bullet_list.size(); i++)
    {
        // ���㵱ǰ�Ƕ�
        double radian = GetTickCount() * TANGENT_SPEED + radian_interval * i;

        // �����ӵ�λ��(Χ�������ת)
        bullet_list[i].position.x = player_position.x + player.FRAME_WIDTH / 2 + (int)(radius * sin(radian));
        bullet_list[i].position.y = player_position.y + player.FRAME_HEIGHT / 2 + (int)(radius * cos(radian));
    }
}

void DrawPlayerScore(int score)
{
    static TCHAR text[64];

    // ��ʽ�������ı�
    _stprintf_s(text, _T("��ǰ�÷֣�%d"), score);

    // �����ı���ʽ
    setbkmode(TRANSPARENT);
    settextcolor(RGB(255, 85, 185));

    // ���Ʒ���
    outtextxy(10, 10, text);
}
