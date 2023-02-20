///<reference path="../config/skill_effect_cfg.ts"/>


/** 声音控制*/


namespace modules.sound {
    import BaseCtrl = modules.core.BaseCtrl;
    import SoundManager = Laya.SoundManager;
    import LocalStorage = Laya.LocalStorage;
    import SceneCfg = modules.config.SceneCfg;
    import sceneFields = Configuration.sceneFields;
    import SkillEffectCfg = modules.config.SkillEffectCfg;
    import SkillEffectFields = Configuration.SkillEffectFields;
    import SkillEffect = Configuration.SkillEffect;
    import Unit = utils.Unit;

    export class SoundCtrl extends BaseCtrl {
        private static _instance: SoundCtrl;
        public static get instance(): SoundCtrl {
            return this._instance = this._instance || new SoundCtrl();
        }

        // 音效是否可用
        private _soundEnabled: boolean;
        // 音乐是否可用
        private _bgMusicEnabled: boolean;
        // 背景音乐
        private _bgMusicUrl: string = "assets/sound/bg_music_1.mp3";
        // 点击音效
        private _btnClickUrl: string = "assets/sound/btn_click.mp3";

        private _playingBGM: string;

        public setup(): void {
            // 初始化音效
            // 新增 无参数应为null,且指定音乐，不指定则只有音效无背景音乐,因为调用之前_playingBGM还未初始化
            if (LocalStorage.getItem(localStorageStrKey.SoundCtrl) === null) {
                LocalStorage.setItem(localStorageStrKey.SoundCtrl, "1")
                this.soundEnabled = true;
            } else {
                this.soundEnabled = LocalStorage.getItem(localStorageStrKey.SoundCtrl) === "1";
            }
            if (LocalStorage.getItem(localStorageStrKey.MusicCtrl) === null) {
                LocalStorage.setItem(localStorageStrKey.MusicCtrl, "1")
                this._playingBGM = "assets/sound/bg_music_1.mp3";
                this._bgMusicEnabled = true;
            } else {
                this._bgMusicEnabled = LocalStorage.getItem(localStorageStrKey.SoundCtrl) === "1";
            }
            this.soundEnabled = LocalStorage.getItem(localStorageStrKey.SoundCtrl) === "1";
            this.bgMusicEnabled = LocalStorage.getItem(localStorageStrKey.MusicCtrl) === "1";
            SoundManager.defaultIntervals[this._btnClickUrl] = -1;
            Laya.stage.on(Laya.Event.CLICK, this, this.clickHandler);
        }

        // 音效是否可用
        public get soundEnabled(): boolean {
            return this._soundEnabled;
        }

        public set soundEnabled(value: boolean) {
            if (this._soundEnabled === value) {
                return;
            }

            this._soundEnabled = value;
            LocalStorage.setItem(localStorageStrKey.SoundCtrl, value ? "1" : "0");
            SoundManager.musicMuted = !value;
            GlobalData.dispatcher.event(CommonEventType.SOUND_ENABLE_CHANGE);

            if (value) {
                SoundManager.playSound(this._btnClickUrl);
            }else{
                SoundManager.stopAllSound();
            }
        }

        // 音乐是否可用
        public get bgMusicEnabled(): boolean {
            return this._bgMusicEnabled;
        }
        public set bgMusicEnabled(value: boolean) {
            if (this._bgMusicEnabled === value) {
                return;
            }

            this._bgMusicEnabled = value;
            LocalStorage.setItem(localStorageStrKey.MusicCtrl, value ? "1" : "0");
            SoundManager.musicMuted = !value;
            GlobalData.dispatcher.event(CommonEventType.SOUND_ENABLE_CHANGE);

           if (value && this._playingBGM) {
                SoundManager.playMusic(this._playingBGM);
            }else{
                SoundManager.stopMusic();
            }
        }

        // 进入场景播放场景音效
        public playSceneBg(sceneId: number): void {
            let sound: string = SceneCfg.instance.getCfgById(sceneId)[sceneFields.sound];
            this._playingBGM = sound ? `assets/sound/${sound}.mp3` : this._bgMusicUrl;
            if (!this.bgMusicEnabled) {
                return;
            }
            SoundManager.playMusic(this._playingBGM);
        }

        // 播放技能音效
        public playSkillSound(skillId: number): void {
            if (!this._soundEnabled) {
                return;
            }
            let cfg: SkillEffect = SkillEffectCfg.instance.getCfgById(skillId * 10000);
            if (cfg) {
                let sound = cfg[SkillEffectFields.sound];
                if (sound) {
                    let url = `assets/sound/${sound}.mp3`;
                    SoundManager.defaultIntervals[url] = 5 * Unit.minute;
                    SoundManager.playSound(url);
                }
            }
        }

        // 播放点击音效
        public playBtnClick(): void {
            if (this._soundEnabled) {
                SoundManager.playSound(this._btnClickUrl);
            }
        }

        // 点击时判断是否是按钮或图片
        private clickHandler(e: Laya.Event): void {
            if (this._soundEnabled) {
                // if (e.target instanceof Laya.Image || e.target instanceof Laya.Button) {
                //     SoundManager.playSound(this._btnClickUrl);
                // }
                if (e.target !== Laya.stage) {
                    SoundManager.playSound(this._btnClickUrl);
                }
            }
        }

        public stopAll(): void {
            SoundManager.stopAll();
        }
    }
}
