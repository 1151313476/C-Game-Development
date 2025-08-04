#include "enemy.h"

Enemy::Enemy()
{
    // ������Ӱͼ��
    loadimage(&img_shadow, _T("img/shadow_enemy.png"));

    // ��ʼ���������
    anim_left = new Animation(g_atlasEnemyLeft, 45);
    anim_right = new Animation(g_atlasEnemyRight, 45);

    // �������λ��(����Ļ��Ե����)
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
    // �ͷŶ�����Դ
    delete anim_left;
    delete anim_right;
}

bool Enemy::CheckBulletCollision(const Bullet& bullet)
{
    // ����ӵ��Ƿ��ڵ�����ײ����
    bool is_overlap_x = bullet.position.x >= position.x &&
        bullet.position.x <= position.x + FRAME_WIDTH;
    bool is_overlap_y = bullet.position.y >= position.y &&
        bullet.position.y <= position.y + FRAME_HEIGHT;
    return is_overlap_x && is_overlap_y;
}

bool Enemy::CheckPlayerCollision(const Player& player)
{
    // ���������ĵ��Ƿ��������ײ����
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
    // ���㳯����ҵķ���
    const POINT& player_position = player.GetPosition();
    int dir_x = player_position.x - position.x;
    int dir_y = player_position.y - position.y;

    // ��׼����������
    double len_dir = sqrt(dir_x * dir_x + dir_y * dir_y);
    if (len_dir != 0)
    {
        double normalized_x = dir_x / len_dir;
        double normalized_y = dir_y / len_dir;
        position.x += (int)(SPEED * normalized_x);
        position.y += (int)(SPEED * normalized_y);
    }

    // ���³���
    if (dir_x < 0)
        facing_left = true;
    else if (dir_x > 0)
        facing_left = false;
}

void Enemy::Draw(int delta)
{
    // ������Ӱ
    int pos_shadow_x = position.x + (FRAME_WIDTH / 2 - SHADOW_WIDTH / 2);
    int pos_shadow_y = position.y + FRAME_HEIGHT - 35;
    putimage_alpha(pos_shadow_x, pos_shadow_y, &img_shadow);

    // ���ݳ��򲥷Ŷ�Ӧ����
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
