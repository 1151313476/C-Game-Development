import { _decorator, Component, Node, RigidBody2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Broken')
export class Broken extends Component {
    rb:RigidBody2D=null;
    protected onLoad(): void {
        this.rb = this.node.getComponent(RigidBody2D);
        this.scheduleOnce(()=>{
            this.node.parent&&this.node.parent.destroy();
        },5)

    }
    force(x:number,y:number){
        let lv=this.rb.linearVelocity;
        this.scheduleOnce(()=>{
            lv.x=x
            lv.y=y
            this.rb.linearVelocity=lv
        },0)
        
    }
}


