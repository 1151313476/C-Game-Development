import { _decorator, AudioClip, AudioSource, Component, Director, director, Node } from 'cc';
import { PLAY_AUDIO } from './Event';
import { AUDIO_EFFECT_ENUM, GAME_EVENT_ENUM } from './Enum';
const { ccclass, property } = _decorator;

@ccclass('MusicManager')
export class MusicManager extends Component {
    @property(AudioClip)
    clickButton: AudioClip = null;
    @property(AudioClip)
    clear: AudioClip = null;
    @property(AudioClip)
    clickBlock: AudioClip = null;
    @property(AudioClip)
    lose: AudioClip = null;
    @property(AudioClip)
    win: AudioClip = null;
    @property(AudioClip)
    mainBgm: AudioClip = null;
    @property(AudioClip)
    gameBgm: AudioClip = null;
    @property(AudioSource)
    audioSource: AudioSource = null;

    protected onLoad(): void {
        director.addPersistRootNode(this.node);
        //注册场景切换事件
        director.on(Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLaunched, this);
        //管理音效事件注册
        PLAY_AUDIO.on(GAME_EVENT_ENUM.PLAY_AUDIO, this.onAudioPlay, this);
    }

    onSceneLaunched() {
        let currentSceneName = director.getScene()?.name;
        this.updateBackGroundMusic(currentSceneName);
    }

    updateBackGroundMusic(sceneName: string) {
        if (sceneName == "Main") {
            this.audioSource.stop();
            this.audioSource.clip = this.mainBgm;
            this.audioSource.play();
        }else if (sceneName === 'Game') {
            this.audioSource.stop();
            this.audioSource.clip = this.gameBgm;
        }
        if (this.audioSource.clip) {
            this.audioSource.play();
        }
    }

    //音效事件回调
    onAudioPlay(type:AUDIO_EFFECT_ENUM) {
        switch (type) {
            case AUDIO_EFFECT_ENUM.CLICKBUTTON://点击按钮音效
                this.audioSource.playOneShot(this.clickButton);
                break;
            case AUDIO_EFFECT_ENUM.CLEAR://消除音效
                this.audioSource.playOneShot(this.clear);
            case AUDIO_EFFECT_ENUM.CLICKBOLCK://点击方块音效
                this.audioSource.playOneShot(this.clickBlock);
                break;
            case AUDIO_EFFECT_ENUM.LOSE://失败音效
                this.audioSource.playOneShot(this.lose);
                break;
            case AUDIO_EFFECT_ENUM.WIN://胜利音效
                this.audioSource.playOneShot(this.win);
                break;
        }
    }

    protected onDestroy(): void {
        director.off(Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneLaunched, this);
        PLAY_AUDIO.off(GAME_EVENT_ENUM.PLAY_AUDIO, this.onAudioPlay, this);
    }
}


