///<reference path="../notice/system_notice_manager.ts"/>
///<reference path="../config/error_code_cfg.ts"/>
///<reference path="../config/item_equip_cfg.ts"/>
///<reference path="../config/item_material_cfg.ts"/>
///<reference path="../config/item_stone_cfg.ts"/>
///<reference path="../config/item_attr_pool_cfg.ts"/>
///<reference path="../config/blend_cfg.ts"/>
///<reference path="../config/item_rune_cfg.ts"/>
///<reference path="../config/rune_refine_cfg.ts"/>
///<reference path="../config/store_cfg.ts"/>

/** 通用工具类*/
namespace modules.common {



    export class EffUtil {
        constructor() {

        }


        //创建特效
        public static creatEff(parentNode: Laya.Node, name: string, maxFrameUrls: number, minFrameUrls: number = 0, loop: boolean = true, durationFrame: number = 5): CustomClip {
            let eff = new CustomClip();
            eff.skin = `assets/effect/${name}.atlas`;
            let resName: string = name.split("/").pop();
            let frameStrs: string[] = [];
            for (let i: int = minFrameUrls; i <= maxFrameUrls; i++) {
                frameStrs.push(`${resName}/${i}.png`);
            }
            eff.frameUrls = frameStrs;
            eff.durationFrame = durationFrame;
            eff.loop = loop;
            if (parentNode) {
                parentNode.addChild(eff);
            }
            return eff;
        }

        //创建按钮特效1 
        public static creatBtnEff1(parentNode: Laya.Node): CustomClip {
            let eff = new CustomClip();
            if (parentNode)
                parentNode.addChild(eff);
            eff.skin = "assets/effect/btn_light.atlas";
            eff.frameUrls = ["btn_light/0.png", "btn_light/1.png", "btn_light/2.png", "btn_light/3.png", "btn_light/4.png",
                "btn_light/5.png", "btn_light/6.png", "btn_light/7.png", "btn_light/8.png", "btn_light/9.png", "btn_light/10.png",
                "btn_light/11.png", "btn_light/12.png", "btn_light/13.png", "btn_light/14.png", "btn_light/15.png"];
            eff.durationFrame = 5;
            eff.loop = true;
            eff.pos(-5, -20);
            eff.scale(1.23, 1.25);
            eff.visible = false;
            return eff;
        }

        //创建上下缓动效果
        public static createTw1(parentNode: Laya.Node, y1: number, y2: number, t1: number, t2: number): TweenJS {
            let tw = TweenJS.create(parentNode).yoyo(true).repeat(99999999)
                .to({ y: y1 }, t1)
                .to({ y: y2 }, t2)
                .start()

            return tw;
        }





    }
}
