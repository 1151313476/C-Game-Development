#include "game_utils.h"
#include "globals.h"

void TryGenerateEnemy(std::vector<Enemy*>& enemy_list)
{
    static int counter = 0;

    // 每100帧生成一个敌人
    if ((++counter) % 100 == 0)
        enemy_list.push_back(new Enemy());
}

void UpdateBullets(std::vector<Bullet>& bullet_list, const Player& player)
{
    const double RADIAL_SPEED = 0.0045;      // 径向运动速度
    const double TANGENT_SPEED = 0.0055;    // 切向运动速度

    // 计算子弹间的弧度间隔
    double radian_interval = 2 * 3.14159 / bullet_list.size();

    // 获取玩家位置
    POINT player_position = player.GetPosition();

    // 计算当前半径(带波动效果)
    double radius = 100 + 25 * sin(GetTickCount() * RADIAL_SPEED);

    // 更新每个子弹位置
    for (size_t i = 0; i < bullet_list.size(); i++)
    {
        // 计算当前角度
        double radian = GetTickCount() * TANGENT_SPEED + radian_interval * i;

        // 计算子弹位置(围绕玩家旋转)
        bullet_list[i].position.x = player_position.x + player.FRAME_WIDTH / 2 + (int)(radius * sin(radian));
        bullet_list[i].position.y = player_position.y + player.FRAME_HEIGHT / 2 + (int)(radius * cos(radian));
    }
}

void DrawPlayerScore(int score)
{
    static TCHAR text[64];

    // 格式化分数文本
    _stprintf_s(text, _T("当前得分：%d"), score);

    // 设置文本样式
    setbkmode(TRANSPARENT);
    settextcolor(RGB(255, 85, 185));

    // 绘制分数
    outtextxy(10, 10, text);
}
