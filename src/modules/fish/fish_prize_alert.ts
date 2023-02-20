/**
 * 通用选取数量弹窗
 * @param <amountParam>
*/
namespace modules.fish {
    import CustomList = modules.common.CustomList; // List

    export class PrizeAlert extends ui.FishPrizeAlertUI {
        constructor() {
            super();
        }

        private tl: CustomList;
        private bl: CustomList;
        private top_list_data: Array<Configuration.Items>;
        private bottom_list_data: Array<Configuration.Items>;
        private init_height: number;
        private init_bg_height: number;
        private init_top_height: number;
        private init_bottom_height: number;
        protected initialize(): void {
            super.initialize();
            this.init_height = this.height;
            this.init_bg_height = this.bgImg.height;
            this.init_top_height = this.topBgImg.height;
            this.init_bottom_height = this.bottomBgImg.height;

            

            this.tl = new CustomList();
            this.bl = new CustomList();
            this.tl.width = this.bl.width = 540;
            this.tl.itemRender = this.bl.itemRender = modules.bag.BaseItem;
            this.topBgImg.addChild(this.tl);
            this.bottomBgImg.addChild(this.bl);
            this.tl.hCount = this.bl.hCount = 5;
            this.tl.x = this.tl.y = this.bl.x = this.bl.y = 15;
            this.tl.spaceX = this.tl.spaceY = this.bl.spaceX = this.bl.spaceY = 10;
        }

        protected addListeners(): void {
            super.addListeners();
        }

        protected removeListeners(): void {
            super.removeListeners();
        }

        public setOpenParam(value: any): void {
            super.setOpenParam(value);

            // let _list = new Array();
            // let _list_key = new Array();
            // for (let i = 0; i < value.length; i++) {
            //     let _quality = CommonUtil.getItemQualityById(value[i][Configuration.ItemsFields.itemId])
            //     if (typeof _list[_quality] == "undefined") {
            //         _list_key.push(_quality);
            //         _list[_quality] = new Array();
            //     }
            //     _list[_quality].push(value[i]);

            // }
            // // console.log('vtz:_list', _list);
            // // console.log('vtz:_list_key', _list_key);
            // // 分列，如果超出两种，最高的放上面 
            // let _tl_key = 0;    // 最高品质
            // for (let i = 0; i < _list_key.length; i++) {
            //     if (_tl_key < _list_key[i]) {
            //         if (_tl_key) {
            //             this.bottom_list_data.concat(_list[_list_key[i]]);
            //         } else {
            //             _tl_key = _list_key[i];
            //             this.top_list_data = _list[_list_key[i]];
            //         }
            //     } else {
            //         if (this.bottom_list_data) {
            //             this.bottom_list_data.concat(_list[_list_key[i]]);
            //         } else {
            //             this.bottom_list_data = _list[_list_key[i]];
            //         }
            //     }
            // }
            this.top_list_data = FishingCfg.instance.getItemLuck(value);
            this.bottom_list_data = FishingCfg.instance.getItemNomal(value);

            // this.bl.itemRender.height
            // let top_add_height = Math.ceil(this.top_list_data.length / 5) * 100
            // let bottom_add_height = Math.ceil(this.bottom_list_data.length / 5) * 100;
            let top_add_height = 200
            let bottom_add_height = 400;
            let count_add_height = top_add_height + bottom_add_height;

            this.tl.height = top_add_height;
            this.bl.height = bottom_add_height;

            this.height = this.init_height + count_add_height;
            this.bgImg.height = this.init_bg_height + count_add_height;
            this.topBgImg.height = this.init_top_height + top_add_height;
            this.bottomBgImg.height = this.init_bottom_height + bottom_add_height;

            // console.log('vtz:this.top_list_data', this.top_list_data);
            this.tl.datas = this.top_list_data;
            this.bl.datas = this.bottom_list_data;
            // console.log('vtz:this.topBgImg', this.topBgImg);


            this.topBgImg.height
            this.bottomBgImg.height
        }

        public onOpened(): void {
            super.onOpened();
        }

        public close(): void {
            super.close();
        }


    }
}