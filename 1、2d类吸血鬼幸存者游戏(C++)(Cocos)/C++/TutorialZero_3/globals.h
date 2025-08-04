#pragma once
#include "atlas.h"

// 游戏运行状态
extern bool g_running;
extern bool g_isGameStarted;

// 资源图集
extern Atlas* g_atlasPlayerLeft;
extern Atlas* g_atlasPlayerRight;
extern Atlas* g_atlasEnemyLeft;
extern Atlas* g_atlasEnemyRight;

// 窗口和UI常量
const int WINDOW_WIDTH = 1280;
const int WINDOW_HEIGHT = 720;
const int BUTTON_WIDTH = 192;
const int BUTTON_HEIGHT = 75;
