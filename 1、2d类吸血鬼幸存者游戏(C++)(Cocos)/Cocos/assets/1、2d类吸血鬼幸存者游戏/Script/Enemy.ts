import { _decorator, Collider, Collider2D, Component, Contact2DType, ICollisionEvent, IPhysics2DContact, Node, PhysicsSystem2D, PolygonCollider2D, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {

    private player: Node = null;

    private moveSpeed: number = 3;
    _shouldDeactivate: boolean;

    protected onLoad(): void {
        const collider = this.getComponent(Collider2D);
        if (collider) {

            // 注册碰撞回调
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

    }

    protected onDestroy(): void {
        const collider = this.getComponent(Collider2D);

        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    update(deltaTime: number) {
        this.move(deltaTime);
        if (this._shouldDeactivate) {
            this.node.active = false;
            this._shouldDeactivate = false;
        }
    }

    //=============================
    move(deltaTime: number) {
        if (!this.player) return;

        const playerPos = this.player.position;
        const enemyPos = this.node.position;

        // 计算方向向量
        const dirX = playerPos.x - enemyPos.x;
        const dirY = playerPos.y - enemyPos.y;

        // 标准化方向向量
        const lenDir = Math.sqrt(dirX * dirX + dirY * dirY);

        if (lenDir > 0) {
            const normalizedX = dirX / lenDir;
            const normalizedY = dirY / lenDir;

            // 计算新位置
            const newPos = new Vec3(
                enemyPos.x + this.moveSpeed * normalizedX * deltaTime * 60,
                enemyPos.y + this.moveSpeed * normalizedY * deltaTime * 60,
                enemyPos.z
            );

            this.node.setPosition(newPos);
        }
    }
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag === 3) { // 假设 tag=3 是子弹
            // 使用 setTimeout 跳出物理回调上下文
            this._shouldDeactivate = true;
        }
    }


    //========= set ===============
    setPlayer(player: Node) {
        this.player = player;
    }
}


