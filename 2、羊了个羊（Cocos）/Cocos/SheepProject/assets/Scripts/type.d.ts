//关卡类型
interface LevelType {
    //棋盘格子(预设每个Block占用3个格子)
    chessWidthNum:number;
    chessHeightNum:number;
    //格子大小 
    chessItemWidth:number;
    chessItemHeight:number;
    //槽位容纳数
    slotNum:number;
    //合成达成数
    clearableNum:number;
    //左随机区块数
    leftRandomBlocks:number;
    //右随机区块数
    rightRandomBlocks:number;
    //层数
    levelNum:number;
    //每层块数
    levelBlockNum:number;
    //块类别数
    blockTypeNum:number;
    //块边界收缩步长
    blockBorderStep:number;
    //块内容
    blockTypeArr:number[];
}

//块类型
interface BlockType {
    id:number;
    x:number;
    y:number;
    width:number;
    height:number;
    level:number;
    boardType:string;//0:普通块 1:左随机块 2:右随机块
    type:number;//块是什么卡牌类型
    higherIds:number[];//被哪些Block压着;
    lowerIds:number[];//压在哪些Block上;
}