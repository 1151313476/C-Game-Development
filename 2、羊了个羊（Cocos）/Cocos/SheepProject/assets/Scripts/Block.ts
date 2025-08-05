import { _decorator, Component, EventTouch, find, Input, Node, Sprite, SpriteAtlas, UITransform, Vec2, Vec3 } from 'cc';
import { AUDIO_EFFECT_ENUM, GAME_BOARD_ENUM, GAME_EVENT_ENUM, GAME_STATUS_ENUM } from './Enum';
import { CHANGE_BOARD, CHECK_CLEAR, PLAY_AUDIO, PLAY_BROKEN } from './Event';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
    id: number;
    //坐标
    x: number;
    y: number;
    //尺寸大小
    width: number;
    height: number;
    //层级
    level: number;
    private _boardType: GAME_BOARD_ENUM;//0:普通块 1:左随机块 2:右随机块
    type: number;//块是什么卡牌类型
    @property({ type: [Number] })
    higherIds: number[];//存储比当前block高的block的id
    @property({ type: [Number] })
    lowerIds: number[];//存储比当前block低的block的id;
    @property(SpriteAtlas)
    spriteAtlas: SpriteAtlas = null;
    //初始化原始数据
    old_boardType: GAME_BOARD_ENUM;
    old_x: number;
    old_y: number;
    old_width: number;
    old_height: number;
    old_level: number;


    get boardType() {
        return this._boardType;
    }

    set boardType(data: GAME_BOARD_ENUM) {
        if (this.boardType != data) {
            this._boardType = data
            CHANGE_BOARD.emit(GAME_EVENT_ENUM.CHANGE_BOARD, this)
        }
    }

    //初始化
    init(block: BlockType) {
        //将block的属性合并到我们当前这个对象中
        Object.assign(this, block)
        //将当前对象添加到DataManager实例的blocks数组中
        DataManager.instance.blocks.push(this);
        // 保存旧的游戏板类型
        this.old_boardType = block.boardType as GAME_BOARD_ENUM
        // 保存旧的 x 坐标
        this.old_x = block.x
        // 保存旧的 y 坐标
        this.old_y = block.y
        // 保存旧的宽度
        this.old_width = block.width
        // 保存旧的高度
        this.old_height = block.height
        // 保存旧的等级
        this.old_level = block.level
        // 渲染当前对象
        this.rendor()
    }

    //块渲染更新
    rendor() {
        this.node.setPosition(this.x, this.y);
        this.node.getComponent(UITransform).width = this.width;
        this.node.getComponent(UITransform).height = this.height;
        this.node.getComponent(UITransform).priority = this.level;
        this.node.getComponent(Sprite).spriteFrame = this.spriteAtlas.getSpriteFrames()[this.type]
        this.node.getChildByName('bg').active = !this.clickable();
    }

    //可点击的状态的方法
    clickable() {
        switch (this.boardType) {
            case GAME_BOARD_ENUM.LEVEL: {
                if (DataManager.instance.clickable) return true;
                return this.higherIds.length <= 0;
            }
            case GAME_BOARD_ENUM.RANDOM_LEFT:
            case GAME_BOARD_ENUM.RANDOM_RIGHT: {
                return this.higherIds.length <= 0;
            }
            case GAME_BOARD_ENUM.LEVEL_EXTEND: {
                return true;
            }
            default: return false;
        }

    }

    //入槽
    toSlot() {
        //遍历当前block的lowerIds数组
        this.lowerIds.forEach((id) => {
            //在DataManager的blocks数组里找到对应的block
            const block: Block = DataManager.instance.blocks.find(item => item.id == id)
            //如果变量block的higerIds数组中包含当前block的id
            if (block.higherIds.findIndex(item => item == this.id) >= 0) {
                //从higerIds数组中删除当前block的id
                block.higherIds.splice(block.higherIds.findIndex(item => item == this.id), 1)
            }
            block.rendor();
        })
        //如果当前块不在DataManager的records中，则进行添加
        if (DataManager.instance.records.findIndex(item => item.id == this.id) == -1) {
            DataManager.instance.records.push(this);
        }
        //初始化当前block的属性
        this.level = 0;
        this.y = 0;
        this.boardType = GAME_BOARD_ENUM.SLOT;
        //排序
        let slots_all = DataManager.instance.blocks.filter(item => item.boardType == GAME_BOARD_ENUM.SLOT)
        let slots_same = DataManager.instance.blocks.filter(item => item.boardType == GAME_BOARD_ENUM.SLOT && item.type == this.type)
        let maxLevel = 0;
        slots_all.forEach(slot => { if (slot.level > maxLevel) maxLevel = slot.level })
        slots_same.forEach(item => {
            item.level = maxLevel + 1;
            item.rendor();
        })
        CHECK_CLEAR.emit(GAME_EVENT_ENUM.CHECK_CLEAR, this);
    }

    //出槽
    toSlotCancel() {
        //获取所有lowerIds数组中的block块
        let targets: Block[] = DataManager.instance.blocks.filter(item => this.lowerIds.includes(item.id))
        //遍历这些targets块
        targets.forEach(target => {
            //如果targets块有higherIds数组
            if (target.higherIds) {
                //将当前block的id添加到targets块的higherIds数组中
                target.higherIds.push(this.id)
                //重新渲染块
                target.rendor()
            }
        })
        //恢复当前块属性的旧值
        this.level = this.old_level;
        this.y = this.old_y;
        this.boardType = this.old_boardType;
        this.rendor();
    }



    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this)
        this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
    }
    onTouchStart(e: EventTouch) {
        if (DataManager.instance.gameStatus != GAME_STATUS_ENUM.RUNNING) return;
        if (!this.clickable()) return;
        //TODO 点击音效
        PLAY_AUDIO.emit(GAME_EVENT_ENUM.PLAY_AUDIO, AUDIO_EFFECT_ENUM.CLICKBOLCK);
        // 点击位置对应到canvas上的坐标
        let location=e.getUILocation();
        let pos=find("Canvas").getComponent(UITransform).convertToNodeSpaceAR(location.toVec3())
        PLAY_BROKEN.emit(GAME_EVENT_ENUM.PLAY_BROKEN,pos,this)
        //TODO 点击动画效果
        this.toSlot();
    }
    onTouchEnd() {
        //TODO
    }

    protected onDestroy(): void {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}


