import { EventTarget } from "cc";

//用于触发和监听游戏棋盘变化的事件
export const CHANGE_BOARD = new EventTarget();
//用于触发和监听检查游戏是否清空的事件
export const CHECK_CLEAR = new EventTarget();
//用于触发和监听游戏是否失败的事件
export const CHECK_LOSED = new EventTarget();
//用于触发和监听游戏是否完成的事件
export const CHECK_COMPLETE = new EventTarget();
//用于触发和监听播放音频的事件
export const PLAY_AUDIO = new EventTarget();
//用于触发和监听播放爆炸特效的事件
export const PLAY_BROKEN = new EventTarget();