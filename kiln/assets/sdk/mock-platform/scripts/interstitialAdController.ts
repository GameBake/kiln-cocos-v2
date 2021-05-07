const {ccclass, property} = cc._decorator;

@ccclass
export default class KilnInterstitialAdController extends cc.Component {

    @property
    autoCloseTime: number = 5;

    @property(cc.Label)
    autoCloseLabel: cc.Label = null;

    @property(cc.Label)
    placementIdLabel: cc.Label = null;

    private _countdown: number;

    private _callback: () => void;

    onLoad() {
        this.autoCloseLabel.string = this.autoCloseTime.toString();
        
        this._countdown = this.autoCloseTime;

        // Only works for root node level
        // We'll only add them to the scene when displayed
        // cc.game.addPersistRootNode(this.node);
    }

    start () {}

    update(dt: number) {
        if (this._countdown > 0)
        {
            this.autoCloseLabel.string = Math.floor(this._countdown).toString();
            this._countdown -= dt;
        }
        else
        {
            this.onClose();
        }
    }

    /**
     * The prefab is disabled by default, display it
     * @param placementId 
     */
    public show(placementId: string, callback: () => void) {
        cc.Canvas.instance.node.addChild(this.node);

        this._callback = callback;
        this.placementIdLabel.string = placementId;
        this.node.active = true;
    }

    /**
     * 
     */
    public onClose() {
        if (this._callback) this._callback();
        this.node.destroy();
    }
}
