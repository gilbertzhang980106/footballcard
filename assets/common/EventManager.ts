class EventManager {
    private static instance
    static getInstance(){
        if (!this.instance) {
            this.instance = new cc.EventTarget()
        }
        return this.instance
    }
}

cc.EventManager = EventManager.getInstance()
