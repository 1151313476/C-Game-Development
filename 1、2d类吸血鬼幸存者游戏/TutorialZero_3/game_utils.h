#pragma once
#include <vector>
#include "enemy.h"
#include "bullet.h"
#include "player.h"

// �������ɵ���
void TryGenerateEnemy(std::vector<Enemy*>& enemy_list);

// �����ӵ�λ��
void UpdateBullets(std::vector<Bullet>& bullet_list, const Player& player);

// ������ҷ���
void DrawPlayerScore(int score);
