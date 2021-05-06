export interface KilnRewardedAdResponse {
    placementId: string,
    withReward: boolean,
}

export enum KilnBannerPosition {
    TopLeft,
    TopCenter,
    TopRight,
    Centered,
    BottomLeft,
    BottomCenter,
    BottomRight
}

export enum KilnBannerSize {
    Width300Height50,
    Width300Height250,
    Width320Height50,
    Width336Height280,
    Width468Height60,
    Width728Height90,
    Width970Height90,
    Width970Height250,
    ScreenWidthHeight50,
    ScreenWidthHeight90,
    ScreenWidthHeight250,
    ScreenWidthHeight280
}

export enum ProductType
{
    Consumable, NonConsumable
}
    
export interface IProduct {
    getProductID: () => string,
    getPrice: () => string,
    getProductType: () => ProductType,
    getDescription: () => string,
    getImageURI: () => string,
    getPriceCurrencyCode: () => string,
    toString: () => string
}

export interface IPurchase {
    getDeveloperPayload: () => string,
    getProductId: () => string,
    getPurchaseToken: () => string,
    getPurchaseTime: () => string,
    getSignedRequest: () => string,
    toString: () => string
}

export interface ILeaderboardEntry {
    getScore: () => number,
    getRank: () => number,
    getPlayer: () => IPlayer,
    toString: () => string,
}

export interface IPlayer {
    getId: () => string,
    getName: () => string,
    getPhotoURL: () => string,
}

export class KilnBridge {

    /**
     * 
     */
    public static init(): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onInitSuccess = () => resolve();
            cc.Kiln.Callbacks.onInitFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "init", "()V");
        
        return promise;
    }

    /**
     * 
     * @returns 
     */
     public static supportsInterstitialAds(): boolean {
        return true;
    }

    /**
     * 
     * @returns 
     */
    public static supportsRewardedAds(): boolean {
        return true;
    }

    /**
     * 
     * @returns 
     */
    public static supportsBannerAds(): boolean {
        return true;
    }
    
    /**
     * 
     * @returns 
     */
    public static supportsIAP(): boolean {
        return true;
    }

    /**
     * 
     * @returns 
     */
    public static supportsLeaderboards(): boolean {
        return true;
    }

    /**
     * 
     * @returns 
     */
    public static supportsPlatformLeaderboardsUI(): boolean {
        return true;
    }

    /**
     * 
     * @param identifier 
     */
    public static loadRewardedAd(identifier: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onLoadRewardedAdSuccess = () => resolve();
            cc.Kiln.Callbacks.onLoadRewardedAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "loadRewardedAd", "(Ljava/lang/String;)V", identifier);
        
        return promise;
    }

    /**
     * 
     * @param identifier 
     */
    public static showRewardedAd(identifier: string): Promise<KilnRewardedAdResponse> {
        let promise = new Promise<KilnRewardedAdResponse>((resolve, reject) => { 
            cc.Kiln.Callbacks.onShowRewardedAdSuccess = (response: KilnRewardedAdResponse) => resolve(response);
            cc.Kiln.Callbacks.onShowRewardedAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "showRewardedAd", "(Ljava/lang/String;)V", identifier);
        
        return promise;
    }
    
    /**
     * 
     * @param identifier 
     */
    public static loadInterstitialdAd(identifier: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onLoadInterstitialAdSuccess = () => resolve();
            cc.Kiln.Callbacks.onLoadInterstitialAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "loadInterstitialAd", "(Ljava/lang/String;)V", identifier);
        
        return promise;
    }

    /**
     * 
     * @param identifier 
     */
    public static showInterstitialAd(identifier: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onShowInterstitialAdSuccess = () => resolve();
            cc.Kiln.Callbacks.onShowInterstitialAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "showInterstitialAd", "(Ljava/lang/String;)V", identifier);
        
        return promise;
    }
    
    /**
     * 
     * @param identifier 
     * @param position 
     * @param maxSize 
     * @returns 
     */
    public static loadBannerAd(identifier: string, position: KilnBannerPosition, maxSize: KilnBannerSize = KilnBannerSize.Width320Height50): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onLoadBannerAdSuccess = () => resolve();
            cc.Kiln.Callbacks.onLoadBannerAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "loadBannerAd", "(Ljava/lang/String;II)V", identifier, position, maxSize);
        
        return promise;
    }

    /**
     * 
     * @param identifier 
     */
    public static showBannerAd(identifier: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onShowBannerAdSuccess = () => resolve();
            cc.Kiln.Callbacks.onShowBannerAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "showBannerAd", "(Ljava/lang/String;)V", identifier);
        
        return promise;
    }
    
    /**
     * 
     * @param identifier 
     */
    public static hideBannerAd(identifier: string): Promise<void> {
        var promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onHideBannerAdSuccess = () => resolve();
            cc.Kiln.Callbacks.onHideBannerAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "hideBannerAd", "(Ljava/lang/String;)V", identifier);
        
        return promise;
    }
    
    /**
     * 
     * @param identifier 
     */
    public static destroyBannerAd(identifier: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onDestroyBannerAdSuccess = () => resolve();
            cc.Kiln.Callbacks.onDestroyBannerAdFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "destroyBannerAd", "(Ljava/lang/String;)V", identifier);
        
        return promise;
    }

    /**
     * 
     * @returns 
     */
    public static getAvailableProducts(): Promise<Array<IProduct>> {
        let promise = new Promise<Array<IProduct>>((resolve, reject) => { 
            cc.Kiln.Callbacks.onGetAvailableProductsSuccess = (products: Array<IProduct>) => resolve(products);
            cc.Kiln.Callbacks.onGetAvailableProductsFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "getAvailableProducts", "()V");
        
        return promise;
    }

    /**
     * 
     * @param ids 
     * @returns 
     */
    public static getAvailableProductsFromList(ids: Array<string>): Promise<Array<IProduct>> {
        let promise = new Promise<Array<IProduct>>((resolve, reject) => { 
            cc.Kiln.Callbacks.onGetAvailableProductsSuccess = (products: Array<IProduct>) => resolve(products);
            cc.Kiln.Callbacks.onGetAvailableProductsFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "getAvailableProducts", "(Ljava/lang/String;)V", JSON.stringify({ ids: ids }));
        
        return promise;
    }

    /**
     * 
     * @returns 
     */
    public static getPurchases(): Promise<Array<IPurchase>> {
        let promise = new Promise<Array<IPurchase>>((resolve, reject) => { 
            cc.Kiln.Callbacks.onGetPurchasesSuccess = (products: Array<IPurchase>) => resolve(products);
            cc.Kiln.Callbacks.onGetPurchasesFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "getPurchases", "()V");
        
        return promise;
    }

    /**
     * 
     * @param productId 
     * @param payload 
     */
    public static purchaseProduct(productId: string, payload: string): Promise<IPurchase> {
        let promise = new Promise<IPurchase>((resolve, reject) => { 
            cc.Kiln.Callbacks.onPurchaseProductSuccess = (purchase: IPurchase) => resolve(purchase);
            cc.Kiln.Callbacks.onPurchaseProductFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "purchaseProduct", "(Ljava/lang/String;Ljava/lang/String;)V", productId, payload);
        
        return promise;
    }

    /**
     * 
     * @param purchaseToken 
     * @returns 
     */
    public static consumePurchasedProduct(purchaseToken: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onConsumePurchasedProductSuccess = () => resolve();
            cc.Kiln.Callbacks.onConsumePurchasedProductFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "consumePurchasedProduct", "(Ljava/lang/String;)V", purchaseToken);
        
        return promise;
    }

    /**
     * 
     * @param leaderboardId 
     * @returns 
     */
    public static getUserScore(leaderboardId: string): Promise<ILeaderboardEntry> {
        let promise = new Promise<ILeaderboardEntry>((resolve, reject) => { 
            cc.Kiln.Callbacks.onGetUserScoreSuccess = (l: ILeaderboardEntry) => resolve(l);
            cc.Kiln.Callbacks.onGetUserScoreFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "getUserScore", "(Ljava/lang/String;)V", leaderboardId);
        
        return promise;
    }

    /**
     * 
     * @param leaderboardId 
     * @param score 
     * @param data 
     * @returns 
     */
    public static setUserScore(leaderboardId: string, score: number, data?: any): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onSetUserScoreSuccess = () => resolve();
            cc.Kiln.Callbacks.onSetUserScoreFailure = (e: Error) => reject(e);
        });

        if (data !== null) data = JSON.stringify(data);

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "setUserScore", "(Ljava/lang/String;FLjava/lang/String;)V", leaderboardId, score, data);
        
        return promise;
    }

    /**
     * 
     * @param amount 
     * @param offset 
     * @param leaderboardId 
     */
    public static getScores(leaderboardId: string, amount: number, offset: number): Promise<Array<ILeaderboardEntry>> {
        let promise = new Promise<Array<ILeaderboardEntry>>((resolve, reject) => { 
            cc.Kiln.Callbacks.onGetScoresSuccess = (scores: Array<ILeaderboardEntry>) => resolve(scores);
            cc.Kiln.Callbacks.onGetScoresFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "getScores", "(Ljava/lang/String;II)V", leaderboardId, amount, offset);
        
        return promise;
    }

    /**
     * 
     * @returns 
     */
    public static showPlatformLeaderboardUI(): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onShowPlatformLeaderboardUISuccess = () => resolve();
            cc.Kiln.Callbacks.onShowPlatformLeaderboardUIFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "showPlatformLeaderboardUI", "()V");
        
        return promise;
    }

    /**
     * 
     * @param eventId 
     */
    public static submitAnalyticsEvent(eventId: string): Promise<void> {
        let promise = new Promise<void>((resolve, reject) => { 
            cc.Kiln.Callbacks.onSubmitAnalyticsEventSuccess = () => resolve();
            cc.Kiln.Callbacks.onSubmitAnalyticsEventFailure = (e: Error) => reject(e);
        });

        jsb.reflection.callStaticMethod("io/gamebake/kilnCocos/Bridge", "submitAnalyticsEvent", "(Ljava/lang/String;)V", eventId);
        
        return promise;
    }
}
