import { IKilnPurchase } from "../../bridge";

const {ccclass, property} = cc._decorator;

@ccclass
export default class KilnIAPController extends cc.Component {

    @property(cc.Label)
    idLabel: cc.Label = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    private _callback: (p: IKilnPurchase) => void;

    private _productId: string;
    private _developerPayload: string;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // Only works for root node level
        // We'll only add them to the scene when displayed
        // cc.game.addPersistRootNode(this.node);
    }

    // start () {}

    // update (dt) {}

    /**
     * 
     * @returns 
     */
    private generatePurchaseToken(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            
            return v.toString(16);
        });
    }

    /**
     * The prefab is disabled by default, display it
     * @param callback 
     * @param productId 
     * @param price 
     * @param payload 
     */
    public show(callback: (p: IKilnPurchase) => void, productId: string, price: string, payload: string) {
        this._callback = callback;

        this.idLabel.string = productId;
        this.priceLabel.string = price;
        this._productId = productId;
        this._developerPayload = payload;

        cc.Canvas.instance.node.addChild(this.node);
        this.node.active = true;
    }

    /**
     * 
     */
    public onPurchaseButton() {
        const uuid = this.generatePurchaseToken();
        const developerPayload = this._developerPayload;
        const time = Date.now().toString();
        const productId = this._productId;

        const purchase: IKilnPurchase = {
            getDeveloperPayload: () => developerPayload,
            getProductId: () => productId,
            getPurchaseToken: () => uuid,
            getPurchaseTime: () => time,
            getSignedRequest: () => "",
            toString: function () {
                return `
                    Product ID: ${this.getProductId()}
                    Purchase Token: ${this.getPurchaseToken()}
                    Developer Payload: ${this.getDeveloperPayload()}
                    Purchase Time: ${this.getPurchaseTime()}
                    Signed Request: ${this.getSignedRequest()}
                `;
            }
        }
        
        if (this._callback) this._callback(purchase);

        this.node.destroy();
    }

    /**
     * 
     */
    public onCancelButton() {
        if (this._callback) this._callback(null);
        
        this.node.destroy();
    }
}
