import IdSelector from "./idSelector";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformLeaderboardController extends cc.Component {

    @property(cc.RichText)
    leaderboardData: cc.RichText = null;

    @property(cc.Node)
    idSelectorNode: cc.Node = null;

    private _idSelector: IdSelector;
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
        const leaderboardID = await this._idSelector.selectID(cc.Kiln.EditorSettings.leaderboards.map((x) => x.id));

        const entries = await cc.Kiln.API.getScores(leaderboardID, 100, 0);

        this.leaderboardData.string = "";

        entries.forEach(entry => {
            this.leaderboardData.string += `${entry.toString()}\n`;
        });
    }

    /**
     * 
     */
    public onCloseButton() {
        this._callback();
        this.node.destroy();
    }
}
