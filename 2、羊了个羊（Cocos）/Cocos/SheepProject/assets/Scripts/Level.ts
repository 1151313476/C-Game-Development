
const card = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
]
export const levels: LevelType[] = [
    {
        /*
        chessWidthNum 用于逻辑计算和棋盘结构的定义。
        chessItemWidth 用于屏幕渲染，决定实际视觉效果。 
        两者结合使用，实现了逻辑与显示的解耦，让棋盘既能符合关卡逻辑，又能灵活适配各种设备和显示需求。
        */
       
        // 棋盘格子(预设每个Block占用3个格子)——逻辑尺寸
        chessWidthNum: 20,
        chessHeightNum: 20,
        // 单个元素(格子)大小——物理尺寸
        chessItemWidth: 22,
        chessItemHeight: 22,

        // 槽位容纳数
        slotNum: 7,
        // 合成达成数
        clearableNum: 3,
        // 左随机区块数
        leftRandomBlocks: 0,
        // 右随机区块数
        rightRandomBlocks: 0,
        // 层数
        levelNum: 2,
        // 每层块数
        levelBlockNum: 9,
        // 块类别数
        blockTypeNum: 3,
        // 块边界收缩步长
        blockBorderStep: 1,
        // 块内容
        blockTypeArr: card
    },
    {
        chessWidthNum: 20,
        chessHeightNum: 20,
        chessItemWidth: 22,
        chessItemHeight: 22,
        slotNum: 7,
        clearableNum: 3,
        leftRandomBlocks: 4,
        rightRandomBlocks: 4,
        levelNum: 4,
        levelBlockNum: 9,
        blockTypeNum: 6,
        blockBorderStep: 1,
        blockTypeArr:card
    },
    {
        chessWidthNum: 20,
        chessHeightNum: 20,
        chessItemWidth: 22,
        chessItemHeight: 22,
        slotNum: 7,
        clearableNum: 3,
        leftRandomBlocks: 6,
        rightRandomBlocks: 6,
        levelNum: 8,
        levelBlockNum: 16,
        blockTypeNum: 12,
        blockBorderStep: 2,
        blockTypeArr:card
    },
    {
        chessWidthNum: 20,
        chessHeightNum: 20,
        chessItemWidth: 22,
        chessItemHeight: 22,
        slotNum: 7,
        clearableNum: 3,
        leftRandomBlocks: 8,
        rightRandomBlocks: 8,
        levelNum: 10,
        levelBlockNum: 18,
        blockTypeNum: 14,
        blockBorderStep: 2,
        blockTypeArr:card
    }
    
]