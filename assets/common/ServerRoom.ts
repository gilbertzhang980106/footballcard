// 这个主要实现 网络协议解析 及分发

import { GameSocket } from "./GameSocket"

export class ServerRoom extends GameSocket {

    roomName: string = "";
    isStopFlushRecv: boolean = false;
    recvCache: any = null;
    listenerOnce: cc.EventTarget = new cc.EventTarget();

    constructor(name: string){
        super();
        this.roomName = name;
        this.recvCache = {};
    }

    getCache(cmd: string) {
        return this.recvCache[cmd]
    }

    setCache(cmd: string, obj: any) {
        this.recvCache[cmd] = obj;
    }

    setStopFlushRecv(bflag: boolean) {
        this.isStopFlushRecv = bflag;
    }

    // 发送消息并且传入收消息回调（多次发送消息） 收到消息回调一次 不会通告notify
    sendAndRecv(obj: any, rCmdStr: string, callback: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => void, ) {
        this.listenerOnce.once(rCmdStr, callback);
        this.sendMessage(obj);
    }

    sendMessage(obj: any) {
        cc.warn(`=> ${obj.cmdKey}` , obj)
        super.sendMessage(JSON.stringify(obj));
    }

    // 分发数据
    flushRecv() {
        if (this.isStopFlushRecv) {
            return
        }
        let text = this.pRecvData.shift();
        if (text == null) {
            return; 
        }
        let obj = {cmdKey:null};
        try {
            obj = JSON.parse(text);         
        } catch (error) {
            obj.cmdKey = text;
        }
        this.notify(obj.cmdKey, obj); 
    }

    notify(cmd: string, obj: any, isSys:boolean = false) {
        cc.log(`<= ${cmd}`, obj)
        this.recvCache[cmd] = obj;
        if (this.listenerOnce.hasEventListener(cmd)) {
            this.listenerOnce.emit(cmd, obj, isSys);
            return;
        }
        
        this.emit(cmd, obj, isSys);
        cc.EventManager.emit(cmd,obj)
    }

    resetData() {
        this.recvCache = {};
        super.resetData();
    }

}
