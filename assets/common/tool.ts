/**
 * 断言方法
 * @param condition 条件为假时输出警告信息：msg 
 * @param msg 
 */
export function assert(condition:boolean,msg:string) {
    if (!condition) {
        cc.warn(msg);
    }
}

export function getLoaclTime(time:number) {
    return new Date(time).toLocaleDateString().replace(/:\d{1,2}$/," ")
}


export function usernameAbbre(account:string,len = 5) {
    assert(account.length > len * 2,`no avilable account account.length <= ${len * 2}!`);
    return account.slice(0,len) + '...' + account.slice(-len);
}

/**
 * 随机值
 * @param min 最小值
 * @param max 最大值
 */
export function random(min,max) {
    assert(min < max,'max >= min')
    return Math.random() * (max - min) + min;
}

export function randomInt(min,max) {
    assert(min < max,'max >= min')
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 转化为带万的单位 50000 => 5 */
export function toWString(money:number,w:string = '万',isShowFuhao:boolean = false) {
    let fuhao = money >= 0 ? "+" : "-"
    money = Math.abs(money)
    let str = money.toString();
    if (money >= 10000) {
        let str1 = (money * 0.0001).toString()
        if (money%10000 != 0) {
            let index =str1.indexOf(".")
            str= str1.substring(0,index+2) + "万"
        } else {
            str = str1 + "万"
        }
    }
    if (isShowFuhao || fuhao == "-") {
        str = fuhao + str
    }
    return str
}

/** 转换成标准货币单位 */
export function formatMoney(number:number, symbol:string = '', precision?:string, thousandsSep?:string, decimalSep?:string, format?:string):string {
    return window['accounting'].formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
}

/** 获取节点的世界坐标 */
export function toWorldSpace(node:cc.Node) {
    return node.convertToWorldSpaceAR(cc.Vec2.ZERO);
}

/** 获取node2相对于node的局部坐标 */
export function toNodeSpace(node:cc.Node,node2:cc.Node) {
    return node.convertToNodeSpaceAR(toWorldSpace(node2))
}

/** 输赢金额转带 + -符号的字符串 */
export function rewardToString(reward:number) {
    return (reward < 0 ? reward.toString() : '+' + reward);
}

/** 数组洗乱 */
export function shuffle(arr:any[]) {
    let l = arr.length;
    for (let i = l - 1; i >= 0; i--) {
        let j = randomInt(0,i);
        [ arr[i],arr[j] ] = [ arr[j], arr[i] ]
    }
}

/** 节点注册鼠标停留提示显示事件 */
export function registerHoverTips(target:cc.Node,msg:string,pos?:cc.Vec2,isRight=false) {
    var tips:cc.Node;
    target.on(cc.Node.EventType.MOUSE_ENTER,()=>{
        if (isRight) {
            pos = toWorldSpace(target).add(cc.v2(target.width / 2, - target.height / 2))
        } else {
            pos = pos || toWorldSpace(target).sub(cc.v2(0,target.height / 2))
        }
        // tips = window.gameController.showHoverTipsPrefab(pos,msg);
        cc.log('MOUSE_ENTER',msg,tips.x,tips.y);
    })
    target.on(cc.Node.EventType.MOUSE_LEAVE,()=>{
        if (tips.isValid) {
            tips.destroy();
            cc.log('MOUSE_LEAVE destroy',msg);
        }
    })
}

export function newEventHandler(componet: cc.Component, handler: string) {
    const e = new cc.Component.EventHandler();
    e.target = componet.node;
    e.component = componet['__classname__'];
    e.handler = handler;
    return e;
}

/** 四舍五入保留n为小数，返回数字 */
export function toFixed(v:number,n:number) {
    const p = Math.pow(10,n);
    return Math.round(v * p) / p;
}

/** 将数字显示为带符号的字符，正数为红色，负数为绿色*/
export function toWinNumber(node:cc.Node,number:number) {
    let str = ""
    if (number >= 0) {
        str = "+" + toWString(number,"万")
        node.color = cc.color(180,0,0)
    } else {
        str = toWString(number,"万")
        node.color = cc.color(0,180,0)
    }
    node.getComponent(cc.Label).string = str
}

/** 获取地址栏参数 */
export function getQueryVariable(code:string) {
    let query = window.location.search.substring(1)
    let data = query.split("&")
    for (let index = 0; index < data.length; index++) {
        let pair = data[index].split("=")
        if (pair[0]==code) {
            return pair[1]
        }
    }
    return false
}

export function getCardValue(card:string) {
    card = card.substring(0,card.length-1)
    let cards = card.split("_")
    let value = parseInt(cards[1])
    return value
}

export function getCardValue2(card:string) {
    card = card.substring(0,card.length-1)
    let cards = card.split("_")
    let value = parseInt(cards[1])
    if (value == 11 || value == 12 || value== 13) {
        value = 10
    }
    return value
}

/** 牛牛规则排列 */
export function nnSort(cards:Array<string>) {
    let arr = []
    for (let i = 0; i < cards.length-2; i++) {
        for (let j = i+1; j < cards.length-1; j++) {
            for (let k = j+1; k < cards.length; k++) {
                if ((getCardValue2(cards[i])+getCardValue2(cards[j])+getCardValue2(cards[k]))%10 == 0){
                    arr.push(cards[k])
                    arr.push(cards[j])
                    arr.push(cards[i])
                    cards.splice(k,1)
                    cards.splice(j,1)
                    cards.splice(i,1)
                    arr.push(cards[1])
                    arr.push(cards[0])
                    return arr
                }
            }
        }
    }
}

/** 牛牛规则排列 */
export function nnSort2(cards:[],type) {
    let count = type == "FULL_HOUSE_NIU" ? 3 : 4
    let arr = []
    let arr2 = []
    for (let i = 0; i < cards.length; i++) {
        if (arr2.length == 0) {
            arr2.push(cards[i])
        }else {
            if (getCardValue(arr2[0]) == getCardValue(cards[i])){
                arr2.push(cards[i])
            } else {
                arr.push(cards[i])
            }
        }
    }
    arr.length == count ? arr.concat(arr2)  : arr2.concat(arr)
    if (arr.length == count) {
        return arr
    }
    return arr2
}
