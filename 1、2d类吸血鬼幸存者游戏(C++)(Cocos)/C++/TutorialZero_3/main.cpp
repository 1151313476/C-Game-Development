// 包含必要的头文件
#include "globals.h"         // 全局变量和常量
#include "graphics_utils.h"  // 图形工具函数
#include "player.h"         // 玩家角色类
#include "bullet.h"         // 子弹类
#include "enemy.h"          // 敌人类
#include "game_buttons.h"   // 游戏按钮类
#include "game_utils.h"     // 游戏工具函数

// 主函数
int main()
{
    // 初始化图形窗口
    initgraph(WINDOW_WIDTH, WINDOW_HEIGHT);

    // 加载角色动画图集资源
    g_atlasPlayerLeft = new Atlas(_T("img/player_left_%d.png"), 6);    // 玩家左移动画
    g_atlasPlayerRight = new Atlas(_T("img/player_right_%d.png"), 6);  // 玩家右移动画
    g_atlasEnemyLeft = new Atlas(_T("img/enemy_left_%d.png"), 6);     // 敌人左移动画
    g_atlasEnemyRight = new Atlas(_T("img/enemy_right_%d.png"), 6);   // 敌人右移动画

    // 初始化音频资源
    mciSendString(_T("open mus/hit.wav alias hit"), NULL, 0, NULL);  // 击中音效
    mciSendString(_T("open mus/bgm.mp3 alias bgm"), NULL, 0, NULL);  // 背景音乐

    // 初始化游戏变量
    int score = 0;                  // 玩家得分
    Player player;                  // 玩家对象
    ExMessage msg;                  // 消息结构体
    IMAGE img_menu;                 // 菜单背景图
    IMAGE img_background;           // 游戏背景图
    std::vector<Enemy*> enemy_list; // 敌人列表
    std::vector<Bullet> bullet_list(1); // 子弹列表(初始3颗)

    // 设置开始按钮区域
    RECT region_btn_start_game;
    region_btn_start_game.left = (WINDOW_WIDTH - BUTTON_WIDTH) / 2;
    region_btn_start_game.right = region_btn_start_game.left + BUTTON_WIDTH;
    region_btn_start_game.top = 430;
    region_btn_start_game.bottom = region_btn_start_game.top + BUTTON_HEIGHT;

    // 设置退出按钮区域
    RECT region_btn_quit_game;
    region_btn_quit_game.left = (WINDOW_WIDTH - BUTTON_WIDTH) / 2;
    region_btn_quit_game.right = region_btn_quit_game.left + BUTTON_WIDTH;
    region_btn_quit_game.top = 550;
    region_btn_quit_game.bottom = region_btn_quit_game.top + BUTTON_HEIGHT;

    // 创建开始游戏按钮
    StartGameButton btn_start_game = StartGameButton(
        region_btn_start_game,
        _T("img/ui_start_idle.png"),    // 默认状态图片
        _T("img/ui_start_hovered.png"), // 悬停状态图片
        _T("img/ui_start_pushed.png")   // 按下状态图片
    );

    // 创建退出游戏按钮
    QuitGameButton btn_quit_game = QuitGameButton(
        region_btn_quit_game,
        _T("img/ui_quit_idle.png"),     // 默认状态图片
        _T("img/ui_quit_hovered.png"),  // 悬停状态图片
        _T("img/ui_quit_pushed.png")    // 按下状态图片
    );

    // 加载菜单和背景图片
    loadimage(&img_menu, _T("img/menu.png"));
    loadimage(&img_background, _T("img/background.png"));

    // 开始批量绘制模式(优化绘制性能)
    BeginBatchDraw();

    // 游戏主循环
    while (g_running)
    {
        // 记录帧开始时间(用于控制帧率)
        DWORD start_time = GetTickCount();

        // 处理所有输入消息
        while (peekmessage(&msg))
        {
            if (g_isGameStarted)
            {
                // 游戏进行中：将输入传递给玩家对象处理
                player.ProcessEvent(msg);
            }
            else
            {
                // 在菜单界面：将输入传递给按钮处理
                btn_start_game.ProcessEvent(msg);
                btn_quit_game.ProcessEvent(msg);
            }
        }

        // 游戏逻辑更新
        if (g_isGameStarted)
        {
            // 尝试生成新敌人(有生成间隔)
            TryGenerateEnemy(enemy_list);

            // 更新玩家位置
            player.Move();

            // 更新子弹位置(使子弹环绕玩家)
            UpdateBullets(bullet_list, player);

            // 更新所有敌人位置(敌人会追踪玩家)
            for (Enemy* enemy : enemy_list)
            {
                enemy->Move(player);
            }

            // 检测子弹与敌人的碰撞
            for (Enemy* enemy : enemy_list)
            {
                for (const Bullet& bullet : bullet_list)
                {
                    if (enemy->CheckBulletCollision(bullet))
                    {
                        // 播放击中音效
                        mciSendString(_T("play hit from 0"), NULL, 0, NULL);

                        // 敌人受到伤害
                        enemy->Hurt();

                        // 增加玩家得分
                        score++;
                    }
                }
            }

            // 移除已死亡的敌人
            for (size_t i = 0; i < enemy_list.size(); i++)
            {
                Enemy* enemy = enemy_list[i];
                if (!enemy->CheckAlive())
                {
                    // 交换到最后然后移除，避免频繁移动元素
                    std::swap(enemy_list[i], enemy_list.back());
                    enemy_list.pop_back();
                    delete enemy;
                }
            }

            // 检测玩家与敌人的碰撞
            for (Enemy* enemy : enemy_list)
            {
                if (enemy->CheckPlayerCollision(player))
                {
                    // 显示游戏结束对话框
                    static TCHAR text[128];
                    _stprintf_s(text, _T("最终得分：%d !"), score);
                    MessageBox(GetHWnd(), text, _T("游戏结束"), MB_OK);

                    // 设置游戏结束标志
                    g_running = false;
                    break;
                }
            }
        }

        // 清空屏幕
        cleardevice();

        // 绘制游戏画面
        if (g_isGameStarted)
        {
            // 绘制游戏背景
            putimage(0, 0, &img_background);

            // 绘制玩家角色
            player.Draw(1000 / 144);  // 传递帧间隔时间(毫秒)

            // 绘制所有敌人
            for (Enemy* enemy : enemy_list)
            {
                enemy->Draw(1000 / 144);
            }

            // 绘制所有子弹
            for (const Bullet& bullet : bullet_list)
            {
                bullet.Draw();
            }

            // 绘制玩家得分
            DrawPlayerScore(score);
        }
        else
        {
            // 绘制菜单界面
            putimage(0, 0, &img_menu);

            // 绘制开始按钮
            btn_start_game.Draw();

            // 绘制退出按钮
            btn_quit_game.Draw();
        }

        // 执行批量绘制(一次性刷新所有绘制操作)
        FlushBatchDraw();

        // 帧率控制(目标144FPS)
        DWORD end_time = GetTickCount();
        DWORD delta_time = end_time - start_time;
        if (delta_time < 1000 / 144)
        {
            // 如果帧执行时间小于目标时间，则等待剩余时间
            Sleep(1000 / 144 - delta_time);
        }
    }

    // 游戏结束，清理资源

    // 释放动画图集资源
    delete g_atlasPlayerLeft;
    delete g_atlasPlayerRight;
    delete g_atlasEnemyLeft;
    delete g_atlasEnemyRight;

    // 结束批量绘制模式
    EndBatchDraw();

    return 0;
}