import { _decorator, Component, instantiate, Node, PhysicsSystem, Prefab, randomRangeInt, Vec3 } from 'cc';
import { Enemy } from './Enemy';
const { ccclass, property } = _decorator;


enum SpawnEdge {
    Up = 0,
    Down,
    Left,
    Right
}


@ccclass('EnemyManager')
export class EnemyManager extends Component {

    @property(Prefab)
    enemyPrefab: Prefab = null;

    @property(Node)
    player: Node = null;

    private enemyList: Node[] = [];

    private time: number = 0;

    // 屏幕尺寸
    private screenWidth = 1920/2;
    private screenHeight = 1080/2;

    // 角色尺寸
    private characterWidth = 200;
    private characterHeight = 200;

    protected onLoad(): void {
        PhysicsSystem.instance.enable = true;
        //生成20个敌人
        for (let index = 0; index < 20; index++) {
            const enemyNode: Node = instantiate(this.enemyPrefab);
            this.node.addChild(enemyNode);
            enemyNode.active = false;
            this.enemyList.push(enemyNode);
        }
    }

    update(deltaTime: number) {
        //周期性激活敌人
        this.time += deltaTime;
        if (this.time > 3) {
            for (let index = 0; index < this.enemyList.length; index++) {
                const enemyNode: Node = this.enemyList[index];
                if (!enemyNode.active) {
                    //位置设置为随机位置（编辑外）
                    this.spawnAtRandomEdge(enemyNode);
                    enemyNode.getComponent(Enemy).setPlayer(this.player);
                    enemyNode.active = true;

                    break;
                }
            }
            this.time = 0;
        }
    }

    //=========================================================================================
    private spawnAtRandomEdge(enemy:Node) {
        const edge: SpawnEdge = randomRangeInt(0, 4);
        const pos = new Vec3();

        switch (edge) {
            case SpawnEdge.Up:
                pos.x = randomRangeInt(0, this.screenWidth);
                pos.y = this.screenHeight + this.characterHeight;
                break;
            case SpawnEdge.Down:
                pos.x = randomRangeInt(0, this.screenWidth);
                pos.y = -this.screenHeight - this.characterHeight;
                break;
            case SpawnEdge.Left:
                pos.x = -this.screenWidth-this.characterWidth;
                pos.y = randomRangeInt(-this.screenHeight, this.screenHeight);
                break;
            case SpawnEdge.Right:
                pos.x = this.screenWidth + this.characterWidth;
                pos.y = randomRangeInt(-this.screenHeight, this.screenHeight);
                break;
        }

        enemy.setPosition(pos);
    }

}


