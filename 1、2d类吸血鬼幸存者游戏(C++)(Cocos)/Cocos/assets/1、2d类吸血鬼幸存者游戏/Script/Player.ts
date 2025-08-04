import { _decorator, Component, EventKeyboard, Input, input, KeyCode, Node, UITransform, Vec3, Animation, Collider2D, Contact2DType, game, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    // 移动状态
    private isMoveUp = false;
    private isMoveDown = false;
    private isMoveLeft = false;
    private isMoveRight = false;

    // 移动速度
    private static readonly SPEED = 5;


    // 动画相关
    private last_facingLeft = false;
    private facingLeft = false;
    private anim: Animation = null;
    private _shouldDeactivate: boolean;


    protected onLoad(): void {
        // 初始化输入监听
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        const collider = this.getComponent(Collider2D);
        if (collider) {

            // 注册碰撞回调
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

    }

    protected onDestroy(): void {
        // 移除输入监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        this.anim = this.node.getComponent(Animation);
    }

    update(deltaTime: number) {
        this.move(deltaTime);
        this.updateAnimation();
        if (this._shouldDeactivate) {
            //游戏结束、跳转主场景
            director.loadScene('MainScene');
        }
    }



    //======================
    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP: this.isMoveUp = true; break;
            case KeyCode.ARROW_DOWN: this.isMoveDown = true; break;
            case KeyCode.ARROW_LEFT: this.isMoveLeft = true; break;
            case KeyCode.ARROW_RIGHT: this.isMoveRight = true; break;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ARROW_UP: this.isMoveUp = false; break;
            case KeyCode.ARROW_DOWN: this.isMoveDown = false; break;
            case KeyCode.ARROW_LEFT: this.isMoveLeft = false; break;
            case KeyCode.ARROW_RIGHT: this.isMoveRight = false; break;
        }
    }

    private move(deltaTime: number) {
        // 计算移动方向
        const dirX = (this.isMoveRight ? 1 : 0) - (this.isMoveLeft ? 1 : 0);
        const dirY = (this.isMoveUp ? 1 : 0) - (this.isMoveDown ? 1 : 0);

        // 标准化方向向量
        const lenDir = Math.sqrt(dirX * dirX + dirY * dirY);
        if (lenDir !== 0) {
            const normalizedX = dirX / lenDir;
            const normalizedY = dirY / lenDir;

            const newPos = new Vec3(
                this.node.position.x + Player.SPEED * normalizedX * deltaTime * 60,
                this.node.position.y + Player.SPEED * normalizedY * deltaTime * 60,
                this.node.position.z
            );


            this.node.setPosition(newPos);
        }

        // 更新朝向
        const currentDirX = (this.isMoveRight ? 1 : 0) - (this.isMoveLeft ? 1 : 0);
        if (currentDirX < 0) {
            this.facingLeft = true;
        } else if (currentDirX > 0) {
            this.facingLeft = false;
        }
    }

    private updateAnimation() {
        if (this.anim) {
            if (this.last_facingLeft != this.facingLeft) {
                const clip = this.facingLeft ? "player_left" : "player_right";

                this.anim.play(clip);
                this.last_facingLeft = this.facingLeft;
            }

        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.tag === 2) { // 假设 tag=2 表示敌人

            // 使用 setTimeout 跳出物理回调上下文
            this._shouldDeactivate = true;
        }
    }
}


