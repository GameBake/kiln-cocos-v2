const {ccclass, property} = cc._decorator;

@ccclass
export default class KilnIdButton extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    private _returnId: string = "";

    public onPressCallback: (id: string) => void;
    
    /**
     * 
     * @returns 
     */
    public onPress() {
        if (this.onPressCallback == null) return;

        this.onPressCallback(this._returnId);
    }

    /**
     * 
     * @param id 
     */
    public setReturnId(id: string) {
        this._returnId = id;
        this.label.string = id;
    }
}
