import { gameData } from "../../component/gameData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullt extends cc.Component {

    @property(cc.RichText)
    bulletinLabel: cc.RichText = null;

    @property(cc.Mask)
    maskNode: cc.Mask = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property({
        tooltip: "每秒移动像素"
    })
    m_speed: number = 100;

    m_xLeftEnd: number = 0;
    m_xRightEnd: number = 0;
    m_ypos: number = 0;
    moving: boolean = false;
    noticeId: number;
    onceId: number;
    @property({
        tooltip: "文字滚动方向，1从左到右，2从右到左"
    })
    m_direction: number = 2;
    /** 循环播放list*/
    protected txtList: Array<any> = [];
    /** 只播放一次list*/
    protected onceList: Array<any> = [];

    static instance: Bullt = null;
    start() {
        this.noticeId = -1;
        this.onceId = 0;
        let self = this;
        this.moving = false;
        this.bulletinLabel.string = "";
        this.node.active = false;
        let marqueeData = gameData.roomData.MARQUEE;
        if (marqueeData && marqueeData.length > 0)
            this.setMarFactory(marqueeData);

    }
    onLoad() {
        Bullt.instance = this;
    }
    update(dt) {
        // if (this.m_direction == Direction.LEFT_TO_RIGHT) { 从左往右移动注释
        //     let contentSize = this.bulletinLabel.node.getContentSize();
        //     if (this.bulletinLabel.node.x >= this.m_xRightEnd) {
        //         this.bulletinLabel.node.x = this.m_xLeftEnd - contentSize.width;
        //         this.moving = false;
        //         this.upBulletin();
        //     } else {
        //         this.bulletinLabel.node.x += this.m_speed * dt;
        //         this.moving = true;
        //     }
        // } else {
        let contentSize = this.bulletinLabel.node.getContentSize();
        if (this.bulletinLabel.node.x <= this.m_xLeftEnd - contentSize.width) {
            this.bulletinLabel.node.x = this.m_xRightEnd;
            this.moving = false;
            let marqueeData = gameData.roomData.MARQUEE;
            if (marqueeData && marqueeData.length > 0)
                this.setMarFactory(marqueeData);
            else
                this.upBulletin();
        } else {
            this.bulletinLabel.node.x -= this.m_speed * dt;
            this.moving = true;
        }
        // }
    }
    public setMarFactory(notice) {
        if (this.txtList == null || this.txtList.length > 1000) this.txtList = [];
        if (this.onceList == null || this.onceList.length > 1000) this.onceList = [];

        let fover = [];
        for (let i = 0; i < notice.length; i++) {
            // if (notice[i].marqueeType == "FOREVER")
            //     fover.push(notice[i]);
            // else
                this.onceList.push(notice[i]);
        }

        this.txtList = fover;
        this.node.active = true;
        gameData.roomData.MARQUEE = [];
        if (!this.moving)
            this.upBulletin();
    }
    /** 更新公告栏 */
    public upBulletin() {
        let s = this;
        //从消息中获取通告列表
        if (s.onceList && s.onceList.length > 0 && s.onceId < s.onceList.length) {

            let notice = s.onceList[s.onceId].content;
            if (notice)
                s.setBulletin(notice);
            s.onceId++;
            console.log("oncelist:" + s.onceList.length + "  index:" + s.onceId);
        } else {

            if (s.txtList == null || s.txtList.length < 1) {
                s.bulletinLabel.string = "";
                s.node.active = false;
                this.moving = false;
                return;
            };
            s.noticeId++;
            if (s.noticeId < 0 || s.noticeId >= s.txtList.length) {
                s.noticeId = 0;
                if (s.txtList.length < 1) {
                    s.bulletinLabel.string = "";
                    s.node.active = false;
                    this.moving = false;
                    return;
                }
            }
            let txt = s.txtList[s.noticeId].content;
            if (txt) {
                s.setBulletin(txt);
            }
        }

    }

    private setBulletin(text) {
        this.bulletinLabel.string = text;
        this.m_xRightEnd = this.node.x + this.maskNode.node.width * this.maskNode.node.anchorX;
        this.m_xLeftEnd = this.node.x - this.maskNode.node.width * this.maskNode.node.anchorX;
        let contentSize = this.bulletinLabel.node.getContentSize();
        let xPos: number = 0;
        if (this.m_direction === Direction.LEFT_TO_RIGHT) {
            xPos = this.m_xLeftEnd - contentSize.width;
        } else
            xPos = this.m_xRightEnd;
        this.bulletinLabel.node.x = xPos;
        this.bulletinLabel.node.y = this.m_ypos;
    }

}
enum Direction {
    LEFT_TO_RIGHT = 1,
    RIGHT_TO_LEFT
}