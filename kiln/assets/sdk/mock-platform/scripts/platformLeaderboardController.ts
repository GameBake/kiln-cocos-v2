import KilnIdSelector from "./idSelector";

const {ccclass, property} = cc._decorator;

@ccclass
export default class KilnPlatformLeaderboardController extends cc.Component {

    @property(cc.RichText)
    leaderboardData: cc.RichText = null;

    @property(cc.Node)
    idSelectorNode: cc.Node = null;

    private _idSelector: KilnIdSelector;
    private _callback: () => void;

    onLoad() {
        this._idSelector = this.idSelectorNode.getComponent("idSelector");
    }

    /**
     * 
     * @param callback 
     */
    public show(callback: () => void) {
        cc.Canvas.instance.node.addChild(this.node);

        this._callback = callback;
    }

    /**
     * 
     */
    public async onSelectLeaderboardButton() {
        const leaderboardID = await this._idSelector.selectID(Kiln.EditorSettings.leaderboards.map((x) => x.id));

        const entries = await Kiln.API.getScores(leaderboardID, 100, 0);
        
        this.leaderboardData.string = entries.join("\n");
    }

    /**
     * 
     */
    public onCloseButton() {
        this._callback();
        this.node.destroy();
    }
}
