import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteAtlas, Vec2 } from 'cc';
import { getRandom } from './Utils';
import { Block } from './Block';
import { PLAY_BROKEN } from './Event';
import { GAME_EVENT_ENUM } from './Enum';
import { Broken } from './Broken';
const { ccclass, property } = _decorator;

@ccclass('BrokenManager')
export class BrokenManager extends Component {
    @property(Prefab)
    brokenPrefab: Prefab[] = [];
    @property({ type: [SpriteAtlas] })
    brokenSpriteAtlas: SpriteAtlas[] = [];

    protected onLoad(): void {
        PLAY_BROKEN.on(GAME_EVENT_ENUM.PLAY_BROKEN,this.onBrokenBuild,this)
    }
    onBrokenBuild(pos:Vec2,block:Block) {
        //创建一个新的结点
        let node: Node = new Node();
        //设置其父节点为当前节点
        node.parent = this.node;
        //获得一个随机数，范围在2到4之间，表示要生成的碎片数量
        let nums = getRandom(2, 4);
        //根据生成的随机数循环创建碎片
        for (let i = 0; i < nums; i++) {
            //计算当前碎片的索引，范围在0-3之间
            let index = i%4;
            //如果预制体的碎片存在，则实例化该预制体
            if(this.brokenPrefab[index]){
                let broken=instantiate(this.brokenPrefab[index]);
                //设置碎片的精灵帧为对应的图片
                broken.getComponent(Sprite).spriteFrame=this.brokenSpriteAtlas[block.type].getSpriteFrames()[index];
                broken.parent=node;
                //调整碎片的位置
                pos.x=pos.x+i;
                pos.y=pos.y+i;
                broken.setPosition(pos.x,pos.y);
                //根据索引的奇偶性设置碎片的力
                let x=getRandom(-40,40);
                let y=0;
                if(i%2==0){
                    y=getRandom(30,60);
                }
                if(i%2==1){
                    y=getRandom(-60,-20);
                }
                //应用力到碎片上
                broken.getComponent(Broken).force(x,y);
            }
        }
    }
    protected onDestroy(): void {
        PLAY_BROKEN.off(GAME_EVENT_ENUM.PLAY_BROKEN,this.onBrokenBuild,this)
    }
}

