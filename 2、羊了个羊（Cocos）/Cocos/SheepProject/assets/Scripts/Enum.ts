//游戏状态
export enum GAME_STATUS_ENUM {
    INIT,
    RUNNING,
    CLEAR,
    LOSED,
    COMPLETE
}

//各区块
export enum GAME_BOARD_ENUM {
    //层级
    LEVEL = 'LEVEL',
    //扩展区
    LEVEL_EXTEND = 'LEVEL_EXTEND',
    //随机左侧
    RANDOM_LEFT = 'RANDOM_LEFT',
    //随机右侧
    RANDOM_RIGHT = 'RANDOM_RIGHT',
    //插槽
    SLOT = 'SLOT',
    //隐藏
    HIDE = 'HIDE'
}
export enum GAME_EVENT_ENUM {
    //游戏检查清楚事件
    CHECK_CLEAR = "CHECK_CLEAR",
    //游戏检查失败事件
    CHECK_LOSED = "CHECK_LOSED",
    //游戏检查完成事件
    CHECK_COMPLETE = "CHECK_COMPLETE",
    //更改游戏面板事件
    CHANGE_BOARD = "CHANGE_BOARD",
    //播放音频事件
    PLAY_AUDIO = "PLAY_AUDIO",
    //播放爆炸特效
    PLAY_BROKEN="PLAY_BROKEN",
}
//音效
export enum AUDIO_EFFECT_ENUM {
    CLICKBUTTON,
    CLEAR,
    CLICKBOLCK,
    LOSE,
    WIN
}
//场景
export enum GAME_SCENE_ENUM {
    MENU = "Menu",
    GAME = "Game"
}