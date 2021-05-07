import { KilnRewardedAdResponse } from "../../bridge";

const {ccclass, property} = cc._decorator;

@ccclass
export default class KilnRewardedAdController extends cc.Component {

    @property(cc.Label)
    placementIdLabel: cc.Label = null;

    private _countdown: number;

    private _callback: (r: KilnRewardedAdResponse) => void;

    onLoad() {
        // Only works for root node level
        // We'll only add them to the scene when displayed
        // cc.game.addPersistRootNode(this.node);
    }

    start () {}

    /**
     * The prefab is disabled by default, display it
     * @param placementId 
     */
    public show(placementId: string, callback: (r: KilnRewardedAdResponse) => void) {
        cc.Canvas.instance.node.addChild(this.node);

        this._callback = callback;
        this.placementIdLabel.string = placementId;
        this.node.active = true;
    }

    /**
     * 
     */
    public onClose() {
        if (this._callback) this._callback({ placementId: this.placementIdLabel.string, withReward: false });
        this.node.destroy();
    }

    /**
     * 
     */
    public onReward() {
        if (this._callback) this._callback({ placementId: this.placementIdLabel.string, withReward: true });
        this.node.destroy();
    }
}
