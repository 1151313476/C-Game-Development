import { _decorator, Component, director, game, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainScene_GameManager')
export class MainScene_GameManager extends Component {

    protected start(): void {
        this.preloadScene();
    }

    GameOver() {
        game.end();
    }

    //场景跳转->战斗场景    
    BattleScene() {
        director.loadScene('GameScene');
    }

    // 预加载场景
    preloadScene() {
        director.preloadScene('GameScene', () => {
            console.log('场景预加载完成');
        });
    }
}


