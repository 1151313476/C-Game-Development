import { _decorator, Component, Node, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SheepMove')
export class SheepMove extends Component {
    @property([Node])
    movePointsTrans:Node[] = [];
    start() {
        if(this.movePointsTrans.length>0){
            this.moveAlongPath();
        }
    }
    moveAlongPath(){
        let points=this.movePointsTrans.map(point=>point.getPosition());
        let currentIndex=0;

        //递归方式使得每次tween结束后继续下一个点循环
        const moveToNextPoint=()=>{
            let targetPos=points[currentIndex];
            currentIndex=(currentIndex+1)%points.length;//循环索引

            //创建新的tween动画，移动到目标点
            tween(this.node)
            .to(1,{position:targetPos},{easing:'sineInOut'})//1秒钟到达 目标点
            .call(moveToNextPoint)//动画结束后调用moveToNextPoint函数，继续下一个点
            .start();
        };
        moveToNextPoint();
    }
    
    update(deltaTime: number) {
        if(this.node.position.y>=0){
            this.node.setScale(-1,1);
        }else{
            this.node.setScale(1,1);
        }
    }
}


