/** 邮件数据*/
///<reference path="../config/blend_cfg.ts"/>


namespace modules.email {
    import BlendCfg = modules.config.BlendCfg;
    import blendFields = Configuration.blendFields;
    import GetEmailsReply = Protocols.GetEmailsReply;
    import GetEmailsReplyFields = Protocols.GetEmailsReplyFields;
    import Email = Protocols.Email;
    import EmailFields = Protocols.EmailFields;
    import UpdateAddEmails = Protocols.UpdateAddEmails;
    import UpdateAddEmailsFields = Protocols.UpdateAddEmailsFields;
    import UpdateEmailsState = Protocols.UpdateEmailsState;
    import UpdateEmailsStateFields = Protocols.UpdateEmailsStateFields;
    import EmailStateFields = Protocols.EmailStateFields;
    import UpdateDelEmails = Protocols.UpdateDelEmails;
    import UpdateDelEmailsFields = Protocols.UpdateDelEmailsFields;

    export class EmailModel {
        private static _instance: EmailModel;
        public static get instance(): EmailModel {
            return this._instance = this._instance || new EmailModel();
        }

        constructor() {
            this.checkArrayDefine();
        }

        private emailId: number = 203;       //用于从表中拿显示邮件数目
        public emailUuidData: Array<string>;    //邮件uuid数据
        public emailShowNum: number;    //显示的数量
        public emailDataShow: Array<Email>;  //主要是用于移除时间在前面的
        public emailA1Data: Array<Email>;    //未读且有附件的邮件
        public emailA2Data: Array<Email>;    //已读且有附件未领取
        public emailA3Data: Array<Email>;    //已读且有附件已领取
        public emailB1Data: Array<Email>;    //未读且没有附件
        public emailB2Data: Array<Email>;    //已读且没有附件
        public hasEmail: boolean;     //用于判断当前是否有邮件
        public newShowEmail: Email;       //用于刷新单个邮件的显示
        public chooseUuid: string = "";   //单个邮件的uuid，判断刷新
        public isChoose: boolean = false;  //判断是否选择某个邮件
        public getAttach: boolean = false; //判断是否正在获取邮件附件,防止出现两次快速点击状况
        public deleteEmail: boolean = false; //判断是否正在获取邮件附件,防止出现两次快速点击状况
        //public oneEmail: boolean = false;

        /**
         * 更新UUID信息
         */
        public emailUuidUpdate(isGame: boolean, uuids: Array<string>): void {
            if (!isGame) {
                this.emailShowNum = BlendCfg.instance.getCfgById(this.emailId)[blendFields.intParam][0];//初始化显示内容
                this.emailA1Data = new Array<Email>();
                this.emailA2Data = new Array<Email>();
                this.emailA3Data = new Array<Email>();
                this.emailB1Data = new Array<Email>();
                this.emailB2Data = new Array<Email>();
                this.emailDataShow = new Array<Email>();
                this.emailUuidData = new Array<string>();
            }
            this.emailUuidData = uuids;
            if (this.emailUuidData.length > 0)
                this.hasEmail = true;
            else {
                this.emailA1Data = new Array<Email>();
                this.emailA2Data = new Array<Email>();
                this.emailA3Data = new Array<Email>();
                this.emailB1Data = new Array<Email>();
                this.emailB2Data = new Array<Email>();
                this.emailDataShow = new Array<Email>();
                this.hasEmail = false;
                if (isGame)
                    GlobalData.dispatcher.event(CommonEventType.EMAIL_LIST_UPDATE);
            }
            this.uuidShow();
        }

        /**
         * 加入uuid以及email信息
         */
        public addUuidAndEmailData(tuple: UpdateAddEmails): void {
            let emails = tuple[UpdateAddEmailsFields.emails];
            if (!this.emailUuidData) this.emailUuidData = [];
            if (this.emailUuidData && this.emailUuidData.length != 0) {
                /*let totalLength = this.emailDataShow.length + emails.length;
                if (totalLength > this.emailShowNum) {
                    let num = totalLength - this.emailShowNum;
                    let starPos = this.emailShowNum - num;
                    let emaildata: Array<Email> = new Array<Email>();
                    emaildata = this.emailDataShow.splice(starPos, num);//截断一部分多余的信息
                    for (let i = 0; i < emaildata.length; i++) {
                        this.disturbEmail(emaildata[i], false, false, true);
                    }
                }*/
                for (let i = 0; i < emails.length; i++) {
                    let emailInfo = emails[i];
                    this.emailUuidData.splice(0, 0, emailInfo[EmailFields.uuid]);
                    this.disturbEmail(emailInfo, false, true, false);
                }
                this.emailDataShow = emails.concat(this.emailDataShow);
            } else {
                if (emails.length > this.emailShowNum) {
                    this.emailDataShow = emails.slice(0, this.emailShowNum);
                } else {
                    this.emailDataShow = emails;
                }
                for (let i = 0; i < emails.length; i++) {
                    let emailInfo = emails[i];
                    if (i < this.emailShowNum) {
                        this.disturbEmail(emailInfo, false, true, false);
                    }
                    this.emailUuidData.push(emailInfo[EmailFields.uuid]);
                }
            }
            this.hasEmail = true;
            GlobalData.dispatcher.event(CommonEventType.EMAIL_LIST_UPDATE);
        }

        /**
         * 截取前X个uuid,并获取信息
         */
        public uuidShow(): void {
            if (this.hasEmail) {
                if (this.emailUuidData.length > this.emailShowNum) {
                    let showUuid: Array<string> = this.emailUuidData.slice(0, this.emailShowNum);
                    EmailCtrl.instance.GetEmails(showUuid);
                } else {
                    EmailCtrl.instance.GetEmails(this.emailUuidData);
                }
            }
        }

        /**
         * 更新显示邮件list
         */
        public emailListUpdate(tuple: GetEmailsReply): void {
            this.emailDataShow = tuple[GetEmailsReplyFields.emails];
            let len = this.emailDataShow.length;
            this.emailA1Data = new Array<Email>();
            this.emailA2Data = new Array<Email>();
            this.emailA3Data = new Array<Email>();
            this.emailB1Data = new Array<Email>();
            this.emailB2Data = new Array<Email>();
            for (let i = 0; i < len; i++) {
                this.disturbEmail(this.emailDataShow[i], false, false, false);
            }
            GlobalData.dispatcher.event(CommonEventType.EMAIL_LIST_UPDATE);
        }

        checkArrayDefine() {
            if (!this.emailA1Data) this.emailA1Data = new Array<Email>();
            if (!this.emailA2Data) this.emailA2Data = new Array<Email>();
            if (!this.emailA3Data) this.emailA3Data = new Array<Email>();
            if (!this.emailB1Data) this.emailB1Data = new Array<Email>();
            if (!this.emailB2Data) this.emailB2Data = new Array<Email>();
        }

        /**
         * 对邮件进行分类
         */
        public disturbEmail(email: Email, needRank: boolean, isFrist: boolean, isCut: boolean) {
            if (email[EmailFields.state] == 0) {
                if (email[EmailFields.items] && email[EmailFields.items].length > 0) {  //未读且有附件
                    if (needRank)
                        this.rankEmails(this.emailA1Data, email);
                    else if (isFrist) {
                        this.emailA1Data.splice(0, 0, email);
                    }
                    // else if (isCut) {
                    //     this.cutOffInfo(this.emailA1Data, email);
                    // }
                    else
                        this.emailA1Data.push(email);
                } else {//未读且没有附件
                    if (needRank)
                        this.rankEmails(this.emailB1Data, email);
                    else if (isFrist) {
                        this.emailB1Data.splice(0, 0, email);
                    }
                    // else if (isCut) {
                    //     this.cutOffInfo(this.emailB1Data, email);
                    // }
                    else
                        this.emailB1Data.push(email);
                }
            } else if (email[EmailFields.state] == 1) {
                if (email[EmailFields.items] && email[EmailFields.items].length > 0) {  //已读且有附件
                    if (needRank)
                        this.rankEmails(this.emailA2Data, email);
                    else if (isFrist) {
                        this.emailA2Data.splice(0, 0, email);
                    }
                    // else if (isCut) {
                    //     this.cutOffInfo(this.emailA2Data, email);
                    // }
                    else
                        this.emailA2Data.push(email);

                } else {//已读且没有附件
                    if (needRank) {
                        this.rankEmails(this.emailB2Data, email);
                    } else if (isFrist) {
                        this.emailB2Data.splice(0, 0, email);
                    }
                    // else if (isCut) {
                    //     this.cutOffInfo(this.emailB2Data, email);
                    // }\
                    else {
                        this.emailB2Data.push(email);
                    }
                }
            } else if (email[EmailFields.state] == 2) { //已领取附件
                if (needRank)
                    this.rankEmails(this.emailA3Data, email);
                else if (isFrist) {
                    this.emailA3Data.splice(0, 0, email);
                } else if (isCut) {
                    this.emailA3Data.splice(0, 0, email);
                } else
                    this.emailA3Data.push(email);
            }
        }

        /**
         * 截掉emaildata的信息
         */
        // private cutOffInfo(type: Array<Email>, emailInfo: Email): void {
        //     for (let i = type.length - 1; i >= 0; i++) {
        //         if (type[i][EmailFields.uuid] == emailInfo[EmailFields.uuid]) {
        //             type.splice(i, 1);
        //             return;
        //         }
        //     }
        // }

        /**
         * 对邮件进行时间排序
         */
        private rankEmails(type: Array<Email>, emailInfo: Email): void {
            if (type) {
                if (type.length == 1) {
                    if (type[0][EmailFields.create_time] < emailInfo[EmailFields.create_time]) {
                        type.splice(0, 0, emailInfo);
                        return;
                    }
                } else {
                    for (let i = 0; i < type.length - 1; i++) {
                        if (i == 0 && type[0][EmailFields.create_time] < emailInfo[EmailFields.create_time]) {
                            type.splice(0, 0, emailInfo);
                            return;
                        } else {
                            if (type[i][EmailFields.create_time] >= emailInfo[EmailFields.create_time] && type[i + 1][EmailFields.create_time] <= emailInfo[EmailFields.create_time]) {
                                type.splice(i + 1, 0, emailInfo);
                                return;
                            }
                        }
                    }
                }
                type.push(emailInfo);
            }
        }

        /**
         * 邮件的红点检测
         */
        public checkHasRedPoint(): boolean {
            if (!this.emailA1Data) return false;
            let emailsInfo = this.emailA1Data.concat(this.emailA2Data, this.emailB1Data);
            if (emailsInfo.length == 0) {
                return false;
            }
            return true;
        }

        /**
         * 改变邮件领取状态
         */
        public emailChangeAttach(tuple: UpdateEmailsState): void {
            for (let j = 0; j < tuple[UpdateEmailsStateFields.states].length; j++) {
                let hasEqual = false;
                let a1Len = this.emailA1Data.length;
                let a1Arr = new Array<number>();
                for (let i = 0; i < a1Len; i++) {
                    if (this.emailA1Data[i][EmailFields.uuid] == tuple[UpdateEmailsStateFields.states][j][EmailStateFields.uuid]) {
                        hasEqual = true;
                        //let emailA1 = this.emailA1Data.splice(i, 1);
                        let emailA1 = this.emailA1Data[i];
                        a1Arr.push(i);
                        emailA1[EmailFields.state] = tuple[UpdateEmailsStateFields.states][j][EmailStateFields.state];
                        if (this.isChoose && emailA1[EmailFields.uuid] == this.chooseUuid) {
                            this.newShowEmail = emailA1 as Email;
                            //this.oneEmail = true;
                            GlobalData.dispatcher.event(CommonEventType.EMAIL_SINGLE_UPDATE);
                        }
                        this.disturbEmail(emailA1, true, false, false);
                        break;
                    }
                }
                for (let a1 = 0; a1 < a1Arr.length; a1++) {
                    this.emailA1Data.splice(a1Arr[a1], 1);
                }
                if (!hasEqual) {
                    let a2Len = this.emailA2Data.length;
                    let a2Arr = new Array<number>();
                    for (let n = 0; n < a2Len; n++) {
                        if (this.emailA2Data[n][EmailFields.uuid] == tuple[UpdateEmailsStateFields.states][j][EmailStateFields.uuid]) {
                            let emailA2 = this.emailA2Data[n];
                            a2Arr.push(n);
                            emailA2[EmailFields.state] = tuple[UpdateEmailsStateFields.states][j][EmailStateFields.state];
                            if (this.isChoose && emailA2[EmailFields.uuid] == this.chooseUuid) {
                                this.newShowEmail = emailA2 as Email;
                                // this.oneEmail = true;
                                GlobalData.dispatcher.event(CommonEventType.EMAIL_SINGLE_UPDATE);
                            }
                            this.disturbEmail(emailA2, true, false, false);
                            break;
                        }
                    }
                    for (let a2 = 0; a2 < a2Arr.length; a2++) {
                        this.emailA2Data.splice(a2Arr[a2], 1);
                    }
                }
            }
            GlobalData.dispatcher.event(CommonEventType.EMAIL_LIST_UPDATE);
        }

        /**
         * 一键删除后设置邮件信息
         */
        public emailDeleteChange(tuple: UpdateDelEmails): void {
            if (tuple.length > 0 && this.emailUuidData) {
                let t: number = 0;
                let uuids: Array<string> = new Array<string>();
                for (let i = 0; i < this.emailUuidData.length; i++) {
                    let isEquals = false;
                    for (let j = 0; j < tuple[UpdateDelEmailsFields.uuids].length; j++) {
                        if (this.emailUuidData[i] == tuple[UpdateDelEmailsFields.uuids][j]) {
                            isEquals = true;
                            break;
                        }
                    }
                    if (!isEquals) {
                        uuids[t] = this.emailUuidData[i];
                        t++;
                    }
                }
                this.emailUuidUpdate(true, uuids);
            }
        }

        /**
         * 改变邮件状态
         */
        public emailStateChange(uuid: string): void {
            //在未读的内容中寻找对应值
            for (let i = 0; i < this.emailA1Data.length; i++) {
                if (uuid == this.emailA1Data[i][EmailFields.uuid]) {
                    let emailA1 = this.emailA1Data.splice(i, 1);
                    emailA1[0][EmailFields.state] = 1;
                    this.disturbEmail(emailA1[0], true, false, false);
                    //this.oneEmail = true;
                    GlobalData.dispatcher.event(CommonEventType.EMAIL_LIST_UPDATE);
                    return;
                }
            }
            for (let j = 0; j < this.emailB1Data.length; j++) {
                if (uuid == this.emailB1Data[j][EmailFields.uuid]) {
                    let emailB1 = this.emailB1Data.splice(j, 1);
                    emailB1[0][EmailFields.state] = 1;
                    this.disturbEmail(emailB1[0], true, false, false);
                    //this.oneEmail = true;
                    GlobalData.dispatcher.event(CommonEventType.EMAIL_LIST_UPDATE);
                    return;
                }
            }
        }
    }
}