import IDButton from "./idButton";

const { ccclass, property } = cc._decorator;

export interface IDSelectorCallbacks {
    select: (id: string) => void,
    cancel: (error: Error) => void
};

@ccclass
export default class IdSelector extends cc.Component {

    @property(cc.Node)
    contentParent: cc.Node = null;

    @property(cc.Prefab)
    idInputPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    idButtonPrefab: cc.Prefab = null;

    public _callbacks: IDSelectorCallbacks = {} as IDSelectorCallbacks;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    /**
     * 
     */ 
    private clean() {
        this.contentParent.destroyAllChildren()
    }

    /**
     * 
     * @param ids 
     */
    private initialize(ids: Array<string>) {
        this.clean();

        // Create the generic input field
        let inputId = cc.instantiate(this.idInputPrefab);
        inputId.parent = this.contentParent;

        let idButton: IDButton = inputId.getComponent("idButton")
        idButton.onPressCallback = this._callbacks.select;

        // Create a button per Id
        ids.forEach((id) => {
            let button = cc.instantiate(this.idButtonPrefab);
            button.parent = this.contentParent;
            
            let idButton: IDButton = button.getComponent("idButton")
            idButton.onPressCallback = this._callbacks.select;
            idButton.setReturnId(id);
        });
    }

    public selectID(ids: Array<string>): Promise<string>
    {
        let promise = new Promise<string>((resolve, reject) => {
            this._callbacks.select = (id: string) => {
                resolve(id);

                this.node.active = false;
            };
            this._callbacks.cancel = (e: Error) => { reject(e); }
        });

        this.initialize(ids);

        this.node.active = true;

        return promise;
    }

    /**
     * 
     */
    public cancel() {
        this._callbacks.cancel(new Error("No Id Selected"));
        
        this.node.active = false;
    }

}
