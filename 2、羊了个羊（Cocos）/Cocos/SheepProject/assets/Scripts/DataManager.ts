import { _decorator, Component, Node, sys } from 'cc';
import { Block } from './Block';
import { GAME_STATUS_ENUM } from './Enum';
const { ccclass, property } = _decorator;

const STORAGE_KEY='SHEEP_STORAGE_KEY';

@ccclass('DataManager')
export class DataManager {
        private static _instance:any=null;

        static getInstance<T>():T{
            if(this._instance===null){
                this._instance=new this();
            }
            return this._instance;
        }

        static get instance(){
            return this.getInstance<DataManager>();
        }

        private _level:number=1;//关卡
        blocks:Block[]=[];//所有block
        records:Block[]=[];//记录块(入槽)
        currentLevel:LevelType=null;//当前关卡数据
        gameStatus:GAME_STATUS_ENUM=GAME_STATUS_ENUM.INIT;//游戏状态
        clickable:boolean=false;//是否可点击

        
        get level()  {
            return this._level
        }
        
        set level(data : number) {
            this._level = data;
            this.save();
        }
        
        //初始化数据
        reset() {
            this.blocks=[];
            this.records=[];
            this.currentLevel=null;
            this.gameStatus=GAME_STATUS_ENUM.INIT;
            this.clickable=false;
        }
        //保存数据
        save(){
            sys.localStorage.setItem(STORAGE_KEY,JSON.stringify({
                level:this.level
            }))
        }

        //读取(加载)数据
        resotre(){
            let _data=sys.localStorage.getItem(STORAGE_KEY);
            try {
                let data=JSON.parse(_data);
                this.level=data?.level||1;
            } catch {
                this.level=1;
                this.reset();
            }
        }
}


