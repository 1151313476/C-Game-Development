#pragma once
#include <vector>
#include "enemy.h"
#include "bullet.h"
#include "player.h"

// 尝试生成敌人
void TryGenerateEnemy(std::vector<Enemy*>& enemy_list);

// 更新子弹位置
void UpdateBullets(std::vector<Bullet>& bullet_list, const Player& player);

// 绘制玩家分数
void DrawPlayerScore(int score);
