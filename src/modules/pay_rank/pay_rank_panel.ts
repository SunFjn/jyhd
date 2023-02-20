/*消费排行面板*/
///<reference path="../config/consume_rank_cfg.ts"/>

namespace modules.payRank {
	import PayRankViewUI = ui.PayRankViewUI;
	import CustomList = modules.common.CustomList;
	import FontClip = Laya.FontClip;
	import ConsumeRank = Protocols.ConsumeRank;
	import ConsumeRankFields = Protocols.ConsumeRankFields;
	import ConsumeRankCfg = modules.config.ConsumeRankCfg;
	import PairFields = Configuration.PairFields;
	import consume_rankFields = Configuration.consume_rankFields;
	import FuncOpenModel = modules.funcOpen.FuncOpenModel;

	export class PayRankPanel extends PayRankViewUI {
		private _list: CustomList;
		private _rankCount: number;
		private table: Table<ConsumeRank> = {};
		private arr: Array<ConsumeRank> = [];

		constructor() {
			super();
		}

		public destroy(destroyChild: boolean = true): void {
			if (this._list) {
				this._list.removeSelf();
				this._list.destroy();
				this._list = null;
			}
			super.destroy(destroyChild);
		}

		protected initialize(): void {
			super.initialize();
			this._list = new CustomList();
			this._list.scrollDir = 1;
			this._list.itemRender = PayRankItem;
			this._list.vCount = 5;
			this._list.hCount = 1;
			this._list.width = 660;
			this._list.height = 624;
			this._list.x = 29;
			this._list.y = 360;
			this._list.spaceY = 6;
			this.addChild(this._list);
			this._rankCount = ConsumeRankCfg.instance.dataArr[ConsumeRankCfg.instance.dataArr.length - 1][consume_rankFields.scope][PairFields.second];
			this.centerX = this.centerY = 0;

		}

		public onOpened(): void {
			super.onOpened();
			PayRankCtrl.instance.getConsumeCount();
			PayRankCtrl.instance.getConsumeRank();
		}

		protected addListeners(): void {
			super.addListeners();
			GlobalData.dispatcher.on(CommonEventType.PAY_RANK_UPDATE, this, this.updateView);
		}

		protected removeListeners(): void {
			super.removeListeners();
			GlobalData.dispatcher.off(CommonEventType.PAY_RANK_UPDATE, this, this.updateView);
		}

		private updateView() {
			this.setActivitiTime();
			this.updateRank();
			this.updateBottom();
		}

		private setActivitiTime(): void {
			this.activityHandler();
			Laya.timer.loop(1000, this, this.activityHandler);
		}

		private activityHandler(): void {
			this.activityText.text = `${modules.common.CommonUtil.timeStampToHHMMSS(PayRankModel.Instance.activityTime)}`;
			if (PayRankModel.Instance.activityTime < GlobalData.serverTime) {
				this.activityEnd.text = "活动已结束";
				this.activityEnd.color = "#ff0000";
				this.activityText.visible = false;
				Laya.timer.clear(this, this.activityHandler);
			}
			else {
				this.activityEnd.text = "活动倒计时：";
				this.activityEnd.color = "#ffffff";
				this.activityText.visible = true;
			}
		}

		private updateRank() {
			this._list.datas = [];
			this.table = {};
			this.arr = [];
			for (let i = 0; i < PayRankModel.Instance.rankList.length; ++i) {
				this.table[PayRankModel.Instance.rankList[i][ConsumeRankFields.rank] - 1] = PayRankModel.Instance.rankList[i];
			}

			for (let i = 0; i < this._rankCount; ++i) {
				this.arr.push(this.table[i]);
			}
			this._list.datas = this.arr;
		}

		private updateBottom(): void {
			let ranks: Array<ConsumeRank> = PayRankModel.Instance.rankList;
			if (!ranks) return;
			let rank: number = PayRankModel.Instance.actorRank(ranks, PlayerModel.instance.actorId);
			if (rank !== 1) {
				this.targetInfo.visible = true;
				this.TargetYB.visible = true;
				this.myRankBox.y = 1048;
				this.myYBBox.y = 1048;
				let lastMc = PayRankModel.Instance.getShuJuByMingCi(50);
				if (rank === -1 && lastMc !== null) {
					this.myRank.text = "未上榜";
					this.myYB.text = `${PayRankModel.Instance.totalPay}`;
					this.targetInfo.text = "第 " + `${50}` + " 名:" + `${lastMc[ConsumeRankFields.name]}`;
					this.TargetYB.text = "消费代币券:" + `${lastMc[ConsumeRankFields.consume]}`;
					this.TargetYB.x = 466;
				}
				else if (rank === -1 && lastMc === null) {
					this.myRank.text = "未上榜";
					this.myYB.text = `${PayRankModel.Instance.totalPay}`;
					this.targetInfo.text = "第 " + `${50}` + " 名:" + "虚位以待";
					this.TargetYB.text = "上榜所需消费代币券:" + `${ConsumeRankCfg.instance.dataArr[ConsumeRankCfg.instance.dataArr.length - 1][consume_rankFields.consume]}`;
					this.TargetYB.x = 378;
				}
				else if (rank > 0 && rank <= this._rankCount && this.table[rank - 2] !== undefined) {
					this.targetInfo.text = "第 " + `${rank - 1}` + " 名:" + `${this.table[rank - 2][ConsumeRankFields.name]}`;
					this.TargetYB.text = "消费代币券:" + `${this.table[rank - 2][ConsumeRankFields.consume]}`;
					this.myRank.text = "第 " + rank + " 名";
					this.myYB.text = `${PayRankModel.Instance.totalPay}`;
					this.TargetYB.x = 466;
				}
				else if (rank > 0 && rank <= this._rankCount && this.table[rank - 2] === undefined) {
					this.targetInfo.text = "第 " + `${rank - 1}` + " 名:" + "虚位以待";
					this.TargetYB.text = "上榜所需消费代币券:" + `${ConsumeRankCfg.instance.getCfgByRank(rank - 2)[consume_rankFields.consume]}`;
					this.myRank.text = "第 " + rank + " 名";
					this.myYB.text = `${PayRankModel.Instance.totalPay}`;
					this.TargetYB.x = 378;
				}
			}
			else {
				this.targetInfo.visible = false;
				this.TargetYB.visible = false;
				let y: number = 0;
				y = this.bottomBG.y + (this.bottomBG.height >> 1) - 12;
				this.myRankBox.y = y;
				this.myYBBox.y = y;
				this.myRank.text = "第 " + rank + " 名";
				this.myYB.text = `${PayRankModel.Instance.totalPay}`;
			}
		}
	}
}
