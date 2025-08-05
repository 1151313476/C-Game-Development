import { _decorator, Component, Node, random } from 'cc';
const { ccclass, property } = _decorator;

//打乱数组
export function shuffle(arr:any[]) {
    //初始化数组长度和临时变量
    let length:number=arr.length,
    randomIndex:number,
    temp:any;
    //当数组长度大于0时，循环进行元素交换
    while(length){
        //随机选一个索引位置
        randomIndex=Math.floor(Math.random()*(length--));
        //交换当前索引位置和随机随意位置的元素
        temp=arr[randomIndex];
        arr[randomIndex]=arr[length];
        arr[length]=temp;
    }
    //返回打乱后的数组
    return arr;
}

// 生产随机数字
export function getRandom(lower: number, upper:number): number {
    return Math.floor(Math.random() * (upper - lower+1)) + lower;
}