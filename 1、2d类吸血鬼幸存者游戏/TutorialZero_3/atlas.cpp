#include "atlas.h"

Atlas::Atlas(LPCTSTR path, int num)
{
    TCHAR path_file[256];
    for (size_t i = 0; i < num; i++)
    {
        // ��ʽ���ļ�·��
        _stprintf_s(path_file, path, i);

        // ����������ͼ��
        IMAGE* frame = new IMAGE();
        loadimage(frame, path_file);

        // ��ӵ�֡�б�
        frame_list.push_back(frame);
    }
}

Atlas::~Atlas()
{
    // �ͷ�����֡��Դ
    for (auto frame : frame_list)
    {
        delete frame;
    }
    frame_list.clear();
}
