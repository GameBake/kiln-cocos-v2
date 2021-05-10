import { IKilnProduct, IKilnPurchase, KilnProductType } from "../../api";
import KilnIAPController from "./iapController";

/**
 * In App Purchase Manager to mock IAP behavior for in Editor development purposes.
 */
export default class KilnInAppPurchases {
    private static readonly _storageKey = "Kiln:IAP";
    public static get storageKey(): string { return this._storageKey; }

    private _products = new Array<IKilnProduct>();
    public get products(): Array<IKilnProduct> { return this._products; }
    private _purchases = new Array<IKilnPurchase>();
    public get purchases():  Array<IKilnPurchase> { return this._purchases; }
    private _nonConsumedPurchases = new Array<IKilnPurchase>();
    public get nonConsumedPurchases(): Array<IKilnPurchase> { return this._nonConsumedPurchases; }
    private _state: KilnIAPData = { purchases: [], nonConsumed: [] };

    /**
     * 
     */
    constructor() {
        cc.Kiln.EditorSettings.iaps.forEach((iap) => {
            let product: IKilnProduct = {
                getProductID: () => iap.id,
                getPrice: () => iap.price,
                getProductType: () => iap.consumable ? KilnProductType.Consumable : KilnProductType.NonConsumable,
                getDescription: () => iap.description,
                getImageURI: () => iap.imageURI,
                getPriceCurrencyCode: () => iap.currencyCode,
                toString: function () {
                    return `
                        Product:
                        ID: ${this.getProductID()}
                        Type: ${this.getProductType()}
                        Price: ${this.getPrice()}
                        Currency: ${this.getPriceCurrencyCode()}
                        Image URI: ${this.getImageURI()}
                        Description: ${this.getDescription()}
                    `;
                }
            }

            this._products.push(product);
        });
        
        // KilnInAppPurchases.reset();
        
        this.load();
    }

    /**
     * 
     */
    private load() {
        const data: KilnIAPData = JSON.parse(cc.sys.localStorage.getItem(KilnInAppPurchases.storageKey));

        if (data) {
            this._state = data;

            this._state.purchases.forEach((iapId) => {
                let purchase: IKilnPurchase = {
                    getDeveloperPayload: () => "",
                    getProductId: () => iapId,
                    getPurchaseToken: () => "",
                    getPurchaseTime: () => "",
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

                this._purchases.push(purchase);
            });

            this._state.nonConsumed.forEach((pendingPurchase) => {
                let purchase: IKilnPurchase = {
                    getDeveloperPayload: () => "",
                    getProductId: () => pendingPurchase.productId,
                    getPurchaseToken: () => pendingPurchase.purchaseToken,
                    getPurchaseTime: () => "",
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
                
                this._nonConsumedPurchases.push(purchase);
            });
        }
    }

    /**
     * 
     */
    private save() {
        this._state.purchases = new Array<string>();
        this._purchases.forEach((purchase) => {
            this._state.purchases.push(purchase.getProductId());
        });

        this._state.nonConsumed = new Array<KilnPendingPurchase>();
        this._nonConsumedPurchases.forEach((pendingPurchase) => {
            this._state.nonConsumed.push({
                productId: pendingPurchase.getProductId(),
                purchaseToken: pendingPurchase.getPurchaseToken()
            });
        });

        cc.sys.localStorage.setItem(KilnInAppPurchases.storageKey, JSON.stringify(this._state));
    }

    /**
     * 
     */
    public static reset() {
        cc.sys.localStorage.removeItem(KilnInAppPurchases.storageKey)
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    private getProduct(id: string): IKilnProduct {
        for (let i = 0; i < this._products.length; i++) {
            const product = this._products[i];

            if (product.getProductID() === id) return product;
        }

        throw new Error(`Product ${id} not in the catalogue.`);
    }

    /**
     * 
     * @param p 
     */
    private processCompletedPurchase(p: IKilnPurchase) {
        // Even if it's a non consumable, we'll add it to the non consumed purchases list
        // which is the list of active IAPs to return upon calling GetPurchasedProducts
        this._nonConsumedPurchases.push(p);
        
        this._purchases.push(p);

        this.save();
    }

    /**
     * 
     * @param productId 
     * @param payload 
     * @returns 
     */
    public purchaseProduct(productId: string, payload: string): Promise<IKilnPurchase> {
        const p = this.getProduct(productId);

        return new Promise<IKilnPurchase>((resolve, reject) => {
            for (let i = 0; i < this._nonConsumedPurchases.length; i++) {
                const pendingPurchase = this._nonConsumedPurchases[i];

                if (pendingPurchase.getProductId() == productId) {
                    let errorMessage: string;
                    if (p.getProductType() == KilnProductType.NonConsumable) {
                        errorMessage = `Product ${p.getProductID()} is a non consumable and already owned.`;
                    }
                    else {
                        errorMessage = `Product ${p.getProductID()} is already owned and waiting for consumption.`;
                    }

                    return reject(new Error(errorMessage));
                }
            }
            
            cc.resources.load("kiln/prefabs/KilnIAP", (err, res: cc.Prefab) => {
                if (err) {
                    return reject(err);
                }
                else {
                    const iapController: KilnIAPController = cc.instantiate(res).getComponent("iapController");
                    const callback = (p: IKilnPurchase) => {
                        if (p == null) return reject(new Error("In App Purchase Canceled"))
                        
                        this.processCompletedPurchase(p);
                        
                        return resolve(p);
                    }
                    iapController.show(callback, productId, p.getPrice(), payload);
                }
            });
        });
    }

    /**
     * 
     * @param purchaseToken 
     * @returns 
     */
    public consumePurchasedProduct(purchaseToken: string): Promise<void> {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < this._nonConsumedPurchases.length; i++) {
                const pendingPurchase = this._nonConsumedPurchases[i];

                if (pendingPurchase.getPurchaseToken() == purchaseToken) {
                    if (this.getProduct(pendingPurchase.getProductId()).getProductType() == KilnProductType.NonConsumable) {
                        return reject(new Error(`Product ${pendingPurchase.getProductId()} is a non consumable and can't be consumed.`));
                    }

                    this._nonConsumedPurchases.splice(i, 1);
                    this.save();
                    return resolve();
                }
            }

            return reject(new Error(`No pending purchase with a ${purchaseToken} token found.`));
        });
    }

}

interface KilnIAPData {
    purchases: Array<string>;
    nonConsumed: Array<KilnPendingPurchase>;
}

interface KilnPendingPurchase {
    productId: string;
    purchaseToken: string;
}