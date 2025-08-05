import { _decorator, animation, Animation, Component, director, find, instantiate, Label, math, Node, Prefab, sys, UITransform } from 'cc';
import { CHANGE_BOARD, CHECK_CLEAR, CHECK_COMPLETE, CHECK_LOSED, PLAY_AUDIO } from './Event';
import { AUDIO_EFFECT_ENUM, GAME_BOARD_ENUM, GAME_EVENT_ENUM, GAME_SCENE_ENUM, GAME_STATUS_ENUM } from './Enum';
import { DataManager } from './DataManager';
import { levels } from './Level';
import { shuffle } from './Utils';
import { Block } from './Block';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    boardLevelNode: Node = null;
    @property(Node)
    boardLevelExtendNode: Node = null;
    @property(Node)
    boardRandomLeftNode: Node = null;
    @property(Node)
    boardRandomRightNode: Node = null;
    @property(Node)
    boardSlotNode: Node = null;
    @property(Node)
    boardHideNode: Node = null;
    @property(Prefab)
    blockPrefab: Prefab = null;
    @property(Label)
    titleLabel: Label = null;
    @property(Node)
    gameOverNode: Node = null;
    @property(Node)
    gameCompleteNode: Node = null;

    protected onLoad(): void {
        director.preloadScene(GAME_SCENE_ENUM.MENU)
        //事件
        CHANGE_BOARD.on(GAME_EVENT_ENUM.CHANGE_BOARD, this.onBoardChange, this)//更换区位的事件
        CHECK_CLEAR.on(GAME_EVENT_ENUM.CHECK_CLEAR, this.onClearCheck, this)// 检查清除的事件
        CHECK_LOSED.on(GAME_EVENT_ENUM.CHECK_LOSED, this.onLosedCheck, this)// 检查失败的事件
        CHECK_COMPLETE.on(GAME_EVENT_ENUM.CHECK_COMPLETE, this.onCompleteCheck, this)// 检查完成的事件
        this.gameStart();
    }
    //开始游戏
    gameStart() {
        //读档
        DataManager.instance.resotre();
        //初始化
        this.initGame(DataManager.instance.level);
        //游戏状态
        DataManager.instance.gameStatus = GAME_STATUS_ENUM.RUNNING;
    }
    //重置游戏
    onGameReset() {
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBUTTON)
        this.gameOverNode.active = false;
        this.gameCompleteNode.active = false;
        DataManager.instance.reset();
        this.gameStart();
    }
    //下一关卡
    onGameNext() {
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBUTTON)
        this.gameCompleteNode.active = false;
        this.gameOverNode.active = false;
        DataManager.instance.level += 1;
        DataManager.instance.reset();
        this.gameStart();
    }

    //#region 技能
    //移出(放入扩展区)
    onGameExtend() {
        if (DataManager.instance.gameStatus != GAME_STATUS_ENUM.RUNNING) return;
        //slot槽的block数据
        let slot_blocks = DataManager.instance.blocks.filter(item => item.boardType == GAME_BOARD_ENUM.SLOT);
        //排序
        slot_blocks.sort((a, b) => a.level - b.level);
        if (slot_blocks.length <= 0) return;
        //扩展区的block数据
        let extend_blocks = DataManager.instance.blocks.filter(item => item.boardType == GAME_BOARD_ENUM.LEVEL_EXTEND);
        if (extend_blocks.length >= DataManager.instance.currentLevel.slotNum) return;
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBUTTON);
        //截取取出block
        let nums = Math.min(3, DataManager.instance.currentLevel.slotNum - extend_blocks.length, slot_blocks.length)
        for (let i = 0; i < nums; i++) {
            slot_blocks[i].boardType = GAME_BOARD_ENUM.LEVEL_EXTEND
            slot_blocks[i].rendor();
        }
    }
    //撤销
    OnGameUndo() {
        if (DataManager.instance.gameStatus != GAME_STATUS_ENUM.RUNNING) return;
        //操作记录出栈
        const block: Block = DataManager.instance.records.pop();
        if (!block) return;
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBUTTON);
        block.toSlotCancel();
    }
    //洗牌
    OnGameshuffle() {
        if (DataManager.instance.gameStatus != GAME_STATUS_ENUM.RUNNING) return;
        //提取数据打乱后重组
        //提取类型为LEVEL的block
        let level_blocks = DataManager.instance.blocks.filter(item => item.boardType == GAME_BOARD_ENUM.LEVEL);
        //如果没有LEVEL类型的block，则return
        if (level_blocks.length <= 0) return;
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBUTTON);
        //将LEVEL类型的block提取出来并打乱
        let contents = shuffle(level_blocks.map(item => item.type));
        let pos = 0;
        //遍历LEVEL板块，将打乱后的内容依次赋值给每个block，并调用渲染方法重新渲染
        level_blocks.forEach(block => {
            //为block赋值新的type
            block.type = contents[pos++]
            block.rendor();
        })
    }
    //明牌
    OnClickable() {
        if (DataManager.instance.gameStatus != GAME_STATUS_ENUM.RUNNING) return;
        let level_blocks = DataManager.instance.blocks.filter(item => item.boardType == GAME_BOARD_ENUM.LEVEL && item.higherIds.length > 0);
        if (level_blocks.length <= 0) return;
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBUTTON);
        DataManager.instance.clickable = !DataManager.instance.clickable;
        level_blocks.forEach(block => {
            block.node.getChildByName('bg').active = !DataManager.instance.clickable;
        })

    }
    //#endregion

    //换区位
    onBoardChange(block: Block) {
        let board = this.boardLevelNode
        if (block.boardType == GAME_BOARD_ENUM.SLOT) board = this.boardSlotNode
        if (block.boardType == GAME_BOARD_ENUM.RANDOM_LEFT) board = this.boardRandomLeftNode
        if (block.boardType == GAME_BOARD_ENUM.RANDOM_RIGHT) board = this.boardRandomRightNode
        if (block.boardType == GAME_BOARD_ENUM.LEVEL_EXTEND) board = this.boardLevelExtendNode
        if (block.boardType == GAME_BOARD_ENUM.HIDE) board = this.boardHideNode
        block.node.setParent(board);
    }
    //消除
    onClearCheck(block: Block) {
        //筛选出所有slot状态的block
        let slot_blocks = DataManager.instance.blocks.filter(item => item.boardType == GAME_BOARD_ENUM.SLOT)
        //筛选出与传入block的Type(类型)相同的block
        let targets = slot_blocks.filter(item => item.type == block.type);
        //判断是否消除
        //通过targets的数量是否达到当前关卡的可消除数量
        if (targets.length >= DataManager.instance.currentLevel.clearableNum) {
            //游戏状态设置为消除状态
            DataManager.instance.gameStatus = GAME_STATUS_ENUM.CLEAR
            //播放消除音效
            PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLEAR)
            //消除
            targets.forEach(target => {
                //移除操作
                //如果在记录中存在与目标block ID相同的记录，则删除该记录
                if (DataManager.instance.records.findIndex(item => item.id == target.id) >= 0) {
                    DataManager.instance.records.splice(DataManager.instance.records.findIndex(item => item.id == target.id), 1);
                }
                //注册动画
                //获取目标block的动画组件
                let anim = target.node.getComponent(Animation);
                anim.off(Animation.EventType.PLAY, this.onClearPlay, target)
                anim.on(Animation.EventType.PLAY, this.onClearPlay, target)
                anim.off(Animation.EventType.STOP, this.onClearStop, target)
                anim.on(Animation.EventType.STOP, this.onClearStop, target)
                //播放动画
                anim.play();
            })
        } else {
            //判断游戏是否结束
            //如果slot的block数量打到了当前关卡的slot数量，则判断游戏是否结束
            if (slot_blocks.length >= DataManager.instance.currentLevel.slotNum) {
                //触发游戏结束事件
                CHECK_LOSED.emit(GAME_EVENT_ENUM.CHECK_LOSED, this);
            }
        }
    }
    //失败
    onLosedCheck() {
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.LOSE)
        DataManager.instance.gameStatus = GAME_STATUS_ENUM.LOSED;
        this.gameOverNode.active = true;
    }
    //完成
    onCompleteCheck() {
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.WIN)
        DataManager.instance.gameStatus = GAME_STATUS_ENUM.COMPLETE
        this.gameCompleteNode.active = true;
        find('Canvas/GameComplete/Panel/Restart').active = DataManager.instance.level >= levels.length;
        find('Canvas/GameComplete/Panel/Next').active = DataManager.instance.level < levels.length;
    }
    //返回菜单
    OnBackMenu() {
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBUTTON)
        director.loadScene(GAME_SCENE_ENUM.MENU);
    }
    //动画开始
    onClearPlay() {
        this.node.getChildByName('bg').active = false;
    }
    //动画结束
    onClearStop() {
        this.node.getChildByName('bg').active = true;
        //设置block状态为隐藏状态
        this.node.getComponent(Block).boardType = GAME_BOARD_ENUM.HIDE;
        //判断是否全部清除
        let unHidden_blocks = DataManager.instance.blocks.filter(item => item.boardType != GAME_BOARD_ENUM.HIDE);
        //如果未隐藏的奇怪数量小于等于0，则游戏结束
        if (unHidden_blocks.length <= 0) {
            //游戏状态设置为完成状态
            CHECK_COMPLETE.emit(GAME_EVENT_ENUM.CHECK_COMPLETE, this);
        } else {
            //设置游戏状态为运行中
            DataManager.instance.gameStatus = GAME_STATUS_ENUM.RUNNING;
        }
    }
    //初始化棋盘
    initChessBox(width: number, height: number) {
        //创建一个二维数组
        const box = new Array(width)
        //遍历宽度
        for (let i = 0; i < width; i++) {
            //初始化每一行
            box[i] = new Array(height);
            for (let j = 0; j < height; j++) {
                //初始化每个格子，设为blocks空数组
                box[i][j] = { blocks: [] }
            }
        }
        return box;
    }

    //初始化游戏
    initGame(num: number) {
        //获取关卡数据
        let currentLevel: LevelType = levels[num - 1]
        if (!currentLevel) {
            if (levels[0]) {
                num = 1
                DataManager.instance.level = num
                currentLevel = levels[0]
            } else {
                return
            }
        }
        //清除节点历史记录
        this.clearNodeHistory();
        //设置当前关卡数据
        DataManager.instance.currentLevel = currentLevel
        //更新标题以显示当前关卡号
        this.titleLabel.string = `第${num}关`

        //blockUnit的计算结果是当前关卡中可以被清楚的块的总数的最小单位，这个值适用于确保生成的总块数能被这个单位整除
        const blockUnit = currentLevel.clearableNum * currentLevel.blockTypeNum;
        //计算总块数Block
        let totalBlockNum = currentLevel.leftRandomBlocks
            + currentLevel.rightRandomBlocks
            + currentLevel.levelNum * currentLevel.levelBlockNum;
        //调整总块数以确保能够被块单位整除
        if (totalBlockNum % blockUnit != 0) totalBlockNum = (Math.floor(totalBlockNum / blockUnit) + 1) * blockUnit;
        // 初始化一个 BlockType 类型的数组，用于存储游戏中的方块对象
        const blockArr: BlockType[] = [];
        let typeArr: number[] = []
        //获取当前关卡的块内容的子集
        const contentTarget = currentLevel.blockTypeArr.slice(0, currentLevel.blockTypeNum)
        //根据总块数和当前关卡的块类型数量，循环填充typeArr数组，确保每个块类型都被均匀分配到总块数中。
        for (let i = 0; i < totalBlockNum; i++) {
            typeArr.push(contentTarget[i % currentLevel.blockTypeNum])
        }
        //打乱数组的顺序
        typeArr = shuffle(typeArr);


        for (let i = 0; i < totalBlockNum; i++) {
            blockArr.push({
                id: i,
                x: null,
                y: null,
                width: currentLevel.chessItemWidth * 3,
                height: currentLevel.chessItemHeight * 3,
                level: 0,
                boardType: null,//0:普通块 1:左随机块 2:右随机块
                type: typeArr[i],//块是什么卡牌类型
                higherIds: [],//当前块高于谁
                lowerIds: []//当前块低于谁
            } as BlockType)
        }

        //这个变量是作为块对象数组(blockArr)中的所有，用于跟踪我们正在处理的块
        let pos = 0

        //初始化随机区域中的块
        //生成左侧随机方块
        for (let i = 0; i < currentLevel.leftRandomBlocks; i++) {
            let node = instantiate(this.blockPrefab)
            node.setParent(this.boardRandomLeftNode)
            blockArr[pos].boardType = GAME_BOARD_ENUM.RANDOM_LEFT;
            blockArr[pos].x -= i * 5;
            blockArr[pos].y = 0;
            blockArr[pos].level -= i + 10;
            //堆叠关系
            let pre = pos - 1;//pos-1就是当前正在处理的方块之前的方块索引，也就是已经建好的方块
            while (pre >= 0) {
                //将pre（即当前正在处理的方块之前的方块索引）添加到当前方块的higherIds数组中，
                blockArr[pos].higherIds.push(pre);
                pre--
            }
            let next = pos + 1;//pos+1就是当前正在处理的方块之后的方块索引，也就是还未建好的方块
            while (next < currentLevel.leftRandomBlocks) {
                //将next（即当前正在处理的方块之后的方块索引）添加到当前方块的lowerIds数组中，
                blockArr[pos].lowerIds.push(next);
                next++
            }
            node.getComponent(Block).init(blockArr[pos])
            pos++;
        }
        //TODO
        //生成右侧随机方块
        for (let i = 0; i < currentLevel.rightRandomBlocks; i++) {
            let node = instantiate(this.blockPrefab)
            node.setParent(this.boardRandomRightNode)
            blockArr[pos].boardType = GAME_BOARD_ENUM.RANDOM_RIGHT;
            blockArr[pos].x += i * 5;
            blockArr[pos].y = 0;
            blockArr[pos].level -= i + 10;
            //堆叠关系
            let pre = pos - 1;
            while (pre >= currentLevel.leftRandomBlocks) {
                blockArr[pos].higherIds.push(pre);
                pre--
            }
            let next = pos + 1;
            while (next < currentLevel.leftRandomBlocks + currentLevel.rightRandomBlocks) {
                blockArr[pos].lowerIds.push(next);
                next++
            }
            node.getComponent(Block).init(blockArr[pos])
            pos++;
        }

        /**
         * 什么时候生成排列规律的块
         * 1.leftRandomBlocks==0
         * 2.rightRandomBlocks==0
         * 3.levelBlockNum % clearableNum==0
         * 4.levelNum*levelBlockNum%clearableNum*blockTypeNum==0
         * 5.levelBlockNum<=16
         */
        /**
         * 检查当前关卡的左右随机方块数是否为0，且关卡的总方块数能被可消除方块数整除
         * 并且关卡总方块数能被可消除方块数与方块种类数的乘积整除。
         * 最后，关卡层方块数是否小于等于16
        */
        let isRandom = true;
        if (currentLevel.leftRandomBlocks == 0
            && currentLevel.rightRandomBlocks == 0
            && currentLevel.levelBlockNum % currentLevel.clearableNum == 0
            && (currentLevel.levelNum * currentLevel.levelBlockNum) % (currentLevel.clearableNum * currentLevel.blockTypeNum) == 0
            && currentLevel.levelBlockNum <= 16
        ) {
            isRandom = false;
        }

        //初始化棋盘（二维数组）
        const chessBox = this.initChessBox(currentLevel.chessWidthNum, currentLevel.chessHeightNum);
        const chessBlocks: BlockType[] = [];
        //初始化关卡区中的块
        let remainBlockNum = totalBlockNum - currentLevel.leftRandomBlocks - currentLevel.rightRandomBlocks;
        //利用剩下的块按层组合
        let minWidth = 0,
            maxWidth = currentLevel.chessWidthNum - 2,
            minHeight = 0,
            maxHeight = currentLevel.chessHeightNum - 2;
        for (let i = 0; i < currentLevel.levelNum; i++) {
            //每一层block的数量
            let blockNum = Math.min(currentLevel.levelBlockNum, remainBlockNum)
            //到后一层
            if (currentLevel.levelNum - 1 == i) blockNum = remainBlockNum;
            //边界收缩逻辑处理(动态调整每一层棋盘的放置区域边界，达成游戏的多样化效果)
            if (currentLevel.blockBorderStep > 0 && i > 0) {
                //4个方向
                switch (i % 4) {
                    case 0://即第1、5、9...层，左侧边界向右收缩
                        minWidth += currentLevel.blockBorderStep;
                        break;
                    case 3://即第3、7、11...层，右侧边界向左收缩
                        maxWidth -= currentLevel.blockBorderStep;
                        break;
                    case 2://即第2、6、10...层，下侧边界向上收缩
                        minHeight += currentLevel.blockBorderStep;
                        break;
                    case 1://即第4、8、12...层，上侧边界向下收缩
                        maxHeight -= currentLevel.blockBorderStep;
                        break;
                }
            }
            //获取块
            const blocks = blockArr.slice(pos, pos + blockNum)
            pos += blockNum//下一次循环中从正确的位置开始提取新的块对象，避免重复提取或跳过某些块对象。

            //生成block块坐标
            const blockPosSet = new Set<string>();
            //遍历所有当前层的块，为每个块生成位置坐标
            for (let j = 0; j < blockNum; j++) {
                const block = blocks[j];
                let nx: number, ny: number, key: string
                if (isRandom) {
                    //更具边界情况生成随机坐标
                    nx = Math.floor(math.random() * (maxWidth - minWidth + 1) + minWidth);
                    ny = Math.floor(math.random() * (maxHeight - minHeight + 1) + minHeight);
                    key = `${nx}_${ny}`;
                    //如果当前循环的块出现重叠
                    if (blockPosSet.has(key)) {
                        //重新重复循环尝试出不重叠的坐标
                        while (true) {
                            nx = Math.floor(math.random() * (maxWidth - minWidth + 1) + minWidth);
                            ny = Math.floor(math.random() * (maxHeight - minHeight + 1) + minHeight);
                            key = `${nx}_${ny}`;
                            if (!blockPosSet.has(key)) break;
                        }
                    }
                } else {//满足规律情况，生成有规律排列的块
                    //计算当前层的levelBlockNum的平方根并向下取整
                    const sqrt = Math.floor(Math.sqrt(currentLevel.levelBlockNum));
                    //根据当前层级的棋盘宽度和levelBlockNum的平方根计算nx的值
                    //j % sqrt * 4：计算当前层级的块在棋盘中的横坐标
                    //Math.floor(currentLevel.chessWidthNum - 3 * sqrt) / 2：计算偏移量，用于块组居中
                    nx = j % sqrt * 4 + Math.floor((currentLevel.chessWidthNum - 3 * sqrt) / 2);
                    //如果sqrt是偶数，则nx-1，需要向左移动一个单位
                    if (sqrt % 2 == 0) nx -= 1
                    //根据当前层级的棋盘宽度和levelBlockNum的平方根计算ny的值
                    ny = Math.floor(j / sqrt) * 5 + i
                    key = `${nx}_${ny}`;
                }
                chessBox?.[nx]?.[ny]?.blocks?.push(block)
                blockPosSet.add(key)

                //堆叠关系
                const minX = Math.max(nx - 2, 0);
                const minY = Math.max(ny - 2, 0);
                const maxX = Math.min(nx + 3, currentLevel.chessWidthNum - 2);
                const maxY = Math.min(ny + 3, currentLevel.chessHeightNum - 2);


                let maxLevel = 0;
                // 遍历周围的格子
                for (let i = minX; i <= maxX; i++) {
                    for (let j = minY; j <= maxY; j++) {
                        const nearlyBlocks = chessBox[i][j].blocks
                        //如果当前格子周围有其他块(Block)
                        if (nearlyBlocks.length > 0) {
                            let topestBlock: Block = nearlyBlocks[nearlyBlocks.length - 1];
                            if (topestBlock.id === block.id) continue;
                            maxLevel = Math.max(maxLevel, topestBlock.level)
                            //将最顶层方块的ID添加到当前方块的 lowerIds 数组中，表示当前方块在其上方
                            block.lowerIds.push(topestBlock.id);
                            //将当前方块的ID添加到最顶层方块的 higherIds 数组中，表示最顶层方块在其下方
                            topestBlock.higherIds.push(block.id);
                        }
                    }
                }
                block.boardType = GAME_BOARD_ENUM.LEVEL;
                block.level = maxLevel + 1;
                block.x = nx * currentLevel.chessItemWidth;
                block.y = ny * currentLevel.chessItemHeight;
            }

            //把当前批次放入chessBlocks数组中
            chessBlocks.push(...blocks);
            //条件递进
            remainBlockNum -= blockNum;
            if (remainBlockNum <= 0) break;
        }
        //棋盘区进行渲染
        chessBlocks.forEach(block => {
            let node = instantiate(this.blockPrefab)
            node.getComponent(Block).init(block);
        })
     

        //棋盘区域居中调整
        let x = currentLevel.chessItemWidth * currentLevel.chessWidthNum / 2 * -1 + currentLevel.chessWidthNum
        let y = currentLevel.chessItemHeight * currentLevel.chessHeightNum / 2 - 300
        this.boardLevelNode.setPosition(x, y);
    }
    clearNodeHistory() {
        this.boardHideNode.removeAllChildren();
        this.boardLevelExtendNode.removeAllChildren();
        this.boardLevelNode.removeAllChildren();
        this.boardRandomLeftNode.removeAllChildren();
        this.boardRandomRightNode.removeAllChildren();
        this.boardSlotNode.removeAllChildren();
        this.boardHideNode.removeAllChildren();
    }
    protected onDestroy(): void {
        CHANGE_BOARD.off(GAME_EVENT_ENUM.CHANGE_BOARD, this.onBoardChange, this)
        CHECK_CLEAR.off(GAME_EVENT_ENUM.CHECK_CLEAR, this.onClearCheck, this)
        CHECK_LOSED.off(GAME_EVENT_ENUM.CHECK_LOSED, this.onLosedCheck, this)
        CHECK_COMPLETE.off(GAME_EVENT_ENUM.CHECK_COMPLETE, this.onCompleteCheck, this)
    }
}