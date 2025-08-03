// ������Ҫ��ͷ�ļ�
#include "globals.h"         // ȫ�ֱ����ͳ���
#include "graphics_utils.h"  // ͼ�ι��ߺ���
#include "player.h"         // ��ҽ�ɫ��
#include "bullet.h"         // �ӵ���
#include "enemy.h"          // ������
#include "game_buttons.h"   // ��Ϸ��ť��
#include "game_utils.h"     // ��Ϸ���ߺ���

// ������
int main()
{
    // ��ʼ��ͼ�δ���
    initgraph(WINDOW_WIDTH, WINDOW_HEIGHT);

    // ���ؽ�ɫ����ͼ����Դ
    g_atlasPlayerLeft = new Atlas(_T("img/player_left_%d.png"), 6);    // ������ƶ���
    g_atlasPlayerRight = new Atlas(_T("img/player_right_%d.png"), 6);  // ������ƶ���
    g_atlasEnemyLeft = new Atlas(_T("img/enemy_left_%d.png"), 6);     // �������ƶ���
    g_atlasEnemyRight = new Atlas(_T("img/enemy_right_%d.png"), 6);   // �������ƶ���

    // ��ʼ����Ƶ��Դ
    mciSendString(_T("open mus/hit.wav alias hit"), NULL, 0, NULL);  // ������Ч
    mciSendString(_T("open mus/bgm.mp3 alias bgm"), NULL, 0, NULL);  // ��������

    // ��ʼ����Ϸ����
    int score = 0;                  // ��ҵ÷�
    Player player;                  // ��Ҷ���
    ExMessage msg;                  // ��Ϣ�ṹ��
    IMAGE img_menu;                 // �˵�����ͼ
    IMAGE img_background;           // ��Ϸ����ͼ
    std::vector<Enemy*> enemy_list; // �����б�
    std::vector<Bullet> bullet_list(1); // �ӵ��б�(��ʼ3��)

    // ���ÿ�ʼ��ť����
    RECT region_btn_start_game;
    region_btn_start_game.left = (WINDOW_WIDTH - BUTTON_WIDTH) / 2;
    region_btn_start_game.right = region_btn_start_game.left + BUTTON_WIDTH;
    region_btn_start_game.top = 430;
    region_btn_start_game.bottom = region_btn_start_game.top + BUTTON_HEIGHT;

    // �����˳���ť����
    RECT region_btn_quit_game;
    region_btn_quit_game.left = (WINDOW_WIDTH - BUTTON_WIDTH) / 2;
    region_btn_quit_game.right = region_btn_quit_game.left + BUTTON_WIDTH;
    region_btn_quit_game.top = 550;
    region_btn_quit_game.bottom = region_btn_quit_game.top + BUTTON_HEIGHT;

    // ������ʼ��Ϸ��ť
    StartGameButton btn_start_game = StartGameButton(
        region_btn_start_game,
        _T("img/ui_start_idle.png"),    // Ĭ��״̬ͼƬ
        _T("img/ui_start_hovered.png"), // ��ͣ״̬ͼƬ
        _T("img/ui_start_pushed.png")   // ����״̬ͼƬ
    );

    // �����˳���Ϸ��ť
    QuitGameButton btn_quit_game = QuitGameButton(
        region_btn_quit_game,
        _T("img/ui_quit_idle.png"),     // Ĭ��״̬ͼƬ
        _T("img/ui_quit_hovered.png"),  // ��ͣ״̬ͼƬ
        _T("img/ui_quit_pushed.png")    // ����״̬ͼƬ
    );

    // ���ز˵��ͱ���ͼƬ
    loadimage(&img_menu, _T("img/menu.png"));
    loadimage(&img_background, _T("img/background.png"));

    // ��ʼ��������ģʽ(�Ż���������)
    BeginBatchDraw();

    // ��Ϸ��ѭ��
    while (g_running)
    {
        // ��¼֡��ʼʱ��(���ڿ���֡��)
        DWORD start_time = GetTickCount();

        // ��������������Ϣ
        while (peekmessage(&msg))
        {
            if (g_isGameStarted)
            {
                // ��Ϸ�����У������봫�ݸ���Ҷ�����
                player.ProcessEvent(msg);
            }
            else
            {
                // �ڲ˵����棺�����봫�ݸ���ť����
                btn_start_game.ProcessEvent(msg);
                btn_quit_game.ProcessEvent(msg);
            }
        }

        // ��Ϸ�߼�����
        if (g_isGameStarted)
        {
            // ���������µ���(�����ɼ��)
            TryGenerateEnemy(enemy_list);

            // �������λ��
            player.Move();

            // �����ӵ�λ��(ʹ�ӵ��������)
            UpdateBullets(bullet_list, player);

            // �������е���λ��(���˻�׷�����)
            for (Enemy* enemy : enemy_list)
            {
                enemy->Move(player);
            }

            // ����ӵ�����˵���ײ
            for (Enemy* enemy : enemy_list)
            {
                for (const Bullet& bullet : bullet_list)
                {
                    if (enemy->CheckBulletCollision(bullet))
                    {
                        // ���Ż�����Ч
                        mciSendString(_T("play hit from 0"), NULL, 0, NULL);

                        // �����ܵ��˺�
                        enemy->Hurt();

                        // ������ҵ÷�
                        score++;
                    }
                }
            }

            // �Ƴ��������ĵ���
            for (size_t i = 0; i < enemy_list.size(); i++)
            {
                Enemy* enemy = enemy_list[i];
                if (!enemy->CheckAlive())
                {
                    // ���������Ȼ���Ƴ�������Ƶ���ƶ�Ԫ��
                    std::swap(enemy_list[i], enemy_list.back());
                    enemy_list.pop_back();
                    delete enemy;
                }
            }

            // ����������˵���ײ
            for (Enemy* enemy : enemy_list)
            {
                if (enemy->CheckPlayerCollision(player))
                {
                    // ��ʾ��Ϸ�����Ի���
                    static TCHAR text[128];
                    _stprintf_s(text, _T("���յ÷֣�%d !"), score);
                    MessageBox(GetHWnd(), text, _T("��Ϸ����"), MB_OK);

                    // ������Ϸ������־
                    g_running = false;
                    break;
                }
            }
        }

        // �����Ļ
        cleardevice();

        // ������Ϸ����
        if (g_isGameStarted)
        {
            // ������Ϸ����
            putimage(0, 0, &img_background);

            // ������ҽ�ɫ
            player.Draw(1000 / 144);  // ����֡���ʱ��(����)

            // �������е���
            for (Enemy* enemy : enemy_list)
            {
                enemy->Draw(1000 / 144);
            }

            // ���������ӵ�
            for (const Bullet& bullet : bullet_list)
            {
                bullet.Draw();
            }

            // ������ҵ÷�
            DrawPlayerScore(score);
        }
        else
        {
            // ���Ʋ˵�����
            putimage(0, 0, &img_menu);

            // ���ƿ�ʼ��ť
            btn_start_game.Draw();

            // �����˳���ť
            btn_quit_game.Draw();
        }

        // ִ����������(һ����ˢ�����л��Ʋ���)
        FlushBatchDraw();

        // ֡�ʿ���(Ŀ��144FPS)
        DWORD end_time = GetTickCount();
        DWORD delta_time = end_time - start_time;
        if (delta_time < 1000 / 144)
        {
            // ���ִ֡��ʱ��С��Ŀ��ʱ�䣬��ȴ�ʣ��ʱ��
            Sleep(1000 / 144 - delta_time);
        }
    }

    // ��Ϸ������������Դ

    // �ͷŶ���ͼ����Դ
    delete g_atlasPlayerLeft;
    delete g_atlasPlayerRight;
    delete g_atlasEnemyLeft;
    delete g_atlasEnemyRight;

    // ������������ģʽ
    EndBatchDraw();

    return 0;
}