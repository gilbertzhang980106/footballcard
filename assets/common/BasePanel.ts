import { newEventHandler } from "./tool";
import { AudioManage } from "./AudioManage"
import dznAudio from "../../component/dznAudio"
const {ccclass, property} = cc._decorator;

/** 弹窗基类
 *  方便拓展弹窗通用逻辑
 */
@ccclass
export default class BasePanel extends cc.Component {

    @property(cc.Button)
    btnClose: cc.Button = null;

    @property(cc.Node)
    mask: cc.Node = null;

    isPlaysound = true;
    
    onLoad() {
        this.mask.on(cc.Node.EventType.TOUCH_END,()=> {
            this.onClose()
        });
        if (this.btnClose) {
            this.btnClose.clickEvents.push(newEventHandler(this,'onClose'));
        }
        this.showAnimation();
        let bgNode = this.node.getChildByName("bg")
        if (bgNode) {
            bgNode.on(cc.Node.EventType.TOUCH_END,()=> {});
        }
    }

    showAnimation() {
        cc.tween(this.node)
        .set({scale:0.01,opacity:255/2})
        .to(84/1000,{scale:1.05, opacity:255})
        .to(116/1000,{scale:1})
        .start();
    }

    onClose() {
        if(this.isPlaysound)AudioManage.playEffect(dznAudio.effect_button_close);
        cc.log('onClose',this.node.name);
        this.node.destroy();
    }

}