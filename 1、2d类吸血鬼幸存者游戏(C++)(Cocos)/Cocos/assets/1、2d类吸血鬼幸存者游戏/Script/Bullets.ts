import { _decorator, CCFloat, Component, director, instantiate, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullets')
export class Bullets extends Component {

    @property(Prefab)
    public Bullet: Node = null;

    @property(CCFloat)
    public Bullets_count: number = 3;

    // 子弹环绕参数
    @property(CCFloat)
    private radialSpeed: number = 0.0045;      // 径向运动速度
    @property(CCFloat)
    private tangentSpeed: number = 0.0055;     // 切向运动速度
    @property(CCFloat)
    private baseRadius: number = 100;          // 基础半径
    @property(CCFloat)
    private radiusVariation: number = 25;      // 半径波动幅度

    private bulletNodes: Node[] = [];

    private startTime: number = 0;

    protected onLoad(): void {
        //生成子弹
        for (let index = 0; index < this.Bullets_count; index++) {
            const bulletNode: Node = instantiate(this.Bullet);
            bulletNode.setPosition(0, 0, 0);
            this.node.addChild(bulletNode);
            this.bulletNodes.push(bulletNode);
        }
    }

    update(deltaTime: number) {
        this.updateBullets();
    }

    private updateBullets() {
        if (this.bulletNodes.length === 0) return;

        // 计算子弹间的弧度间隔
        const radianInterval = (2 * Math.PI) / this.bulletNodes.length;

        // 获取玩家位置和尺寸
        const playerPos = this.node.position;

        // 计算当前半径(带波动效果)
        const currentTime = director.getTotalFrames() - this.startTime;
        const radius = this.baseRadius + this.radiusVariation * Math.sin(currentTime * this.radialSpeed);

        // 更新每个子弹位置
        this.bulletNodes.forEach((bulletNode, index) => {
            if (!bulletNode.isValid) return;

            // 计算当前角度
            const radian = currentTime * this.tangentSpeed + radianInterval * index;

            // 计算子弹位置(围绕玩家旋转)
            const bulletPos = new Vec3(
                playerPos.x +  radius * Math.sin(radian),
                playerPos.y +  radius * Math.cos(radian),
                playerPos.z
            );

            bulletNode.setPosition(bulletPos);
        });
    }
}


