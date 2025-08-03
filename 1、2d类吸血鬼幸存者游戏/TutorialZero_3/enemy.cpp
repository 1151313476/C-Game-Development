#include "enemy.h"

Enemy::Enemy()
{
    // 加载阴影图像
    loadimage(&img_shadow, _T("img/shadow_enemy.png"));

    // 初始化动画组件
    anim_left = new Animation(g_atlasEnemyLeft, 45);
    anim_right = new Animation(g_atlasEnemyRight, 45);

    // 随机生成位置(从屏幕边缘生成)
    enum class SpawnEdge { Up = 0, Down, Left, Right };
    SpawnEdge edge = (SpawnEdge)(rand() % 4);

    switch (edge)
    {
    case SpawnEdge::Up:
        position.x = rand() % WINDOW_WIDTH;
        position.y = -FRAME_HEIGHT;
        break;
    case SpawnEdge::Down:
        position.x = rand() % WINDOW_WIDTH;
        position.y = WINDOW_HEIGHT;
        break;
    case SpawnEdge::Left:
        position.x = -FRAME_WIDTH;
        position.y = rand() % WINDOW_HEIGHT;
        break;
    case SpawnEdge::Right:
        position.x = WINDOW_WIDTH;
        position.y = rand() % WINDOW_HEIGHT;
        break;
    }
}

Enemy::~Enemy()
{
    // 释放动画资源
    delete anim_left;
    delete anim_right;
}

bool Enemy::CheckBulletCollision(const Bullet& bullet)
{
    // 检查子弹是否在敌人碰撞框内
    bool is_overlap_x = bullet.position.x >= position.x &&
        bullet.position.x <= position.x + FRAME_WIDTH;
    bool is_overlap_y = bullet.position.y >= position.y &&
        bullet.position.y <= position.y + FRAME_HEIGHT;
    return is_overlap_x && is_overlap_y;
}

bool Enemy::CheckPlayerCollision(const Player& player)
{
    // 检查敌人中心点是否在玩家碰撞框内
    POINT check_position = {
        position.x + FRAME_WIDTH / 2,
        position.y + FRAME_HEIGHT / 2
    };

    const POINT& player_position = player.GetPosition();

    bool is_overlap_x = check_position.x >= player_position.x &&
        check_position.x <= player_position.x + player.FRAME_WIDTH;
    bool is_overlap_y = check_position.y >= player_position.y &&
        check_position.y <= player_position.y + player.FRAME_HEIGHT;
    return is_overlap_x && is_overlap_y;
}

void Enemy::Move(const Player& player)
{
    // 计算朝向玩家的方向
    const POINT& player_position = player.GetPosition();
    int dir_x = player_position.x - position.x;
    int dir_y = player_position.y - position.y;

    // 标准化方向向量
    double len_dir = sqrt(dir_x * dir_x + dir_y * dir_y);
    if (len_dir != 0)
    {
        double normalized_x = dir_x / len_dir;
        double normalized_y = dir_y / len_dir;
        position.x += (int)(SPEED * normalized_x);
        position.y += (int)(SPEED * normalized_y);
    }

    // 更新朝向
    if (dir_x < 0)
        facing_left = true;
    else if (dir_x > 0)
        facing_left = false;
}

void Enemy::Draw(int delta)
{
    // 绘制阴影
    int pos_shadow_x = position.x + (FRAME_WIDTH / 2 - SHADOW_WIDTH / 2);
    int pos_shadow_y = position.y + FRAME_HEIGHT - 35;
    putimage_alpha(pos_shadow_x, pos_shadow_y, &img_shadow);

    // 根据朝向播放对应动画
    if (facing_left)
        anim_left->Play(position.x, position.y, delta);
    else
        anim_right->Play(position.x, position.y, delta);
}

void Enemy::Hurt()
{
    alive = false;
}

bool Enemy::CheckAlive()
{
    return alive;
}
