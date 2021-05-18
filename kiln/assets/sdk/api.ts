import KilnBannerAdController from "./mock-platform/scripts/bannerAdController";
import KilnInAppPurchases from "./mock-platform/scripts/inAppPurchases";
import KilnInterstitialAdController from "./mock-platform/scripts/interstitialAdController";
import KilnLeaderboard from "./mock-platform/scripts/leaderboard";
import KilnPlatformLeaderboardController from "./mock-platform/scripts/platformLeaderboardController";
import KilnRewardedAdController from "./mock-platform/scripts/rewardedAdController";

/**
 * Kiln API
 * 
 * Accessible globally through Kiln.API
 * 
 * ```typescript
 * // Examples:
 * 
 * // Initialization
 * Kiln.API.init();
 * 
 * // Check for Rewarded Ads support:
 * Kiln.API.supportsRewardedAds();
 * ```
 */
export class KilnAPI {
    private static _initialized: boolean = false;
    private static _interstitialAds: Map<string, KilnInterstitialAdController> = new Map<string, KilnInterstitialAdController>();
    private static _rewardedAds: Map<string, KilnRewardedAdController> = new Map<string, KilnRewardedAdController>();
    private static _bannerAds: Map<string, KilnBannerAdController> = new Map<string, KilnBannerAdController>();
    private static _leaderboards: Map<string, KilnLeaderboard> = new Map<string, KilnLeaderboard>();
    private static _iap: KilnInAppPurchases;

    /**
     * @internal
     * "Static class". Remove constructor from docs
     */
    constructor() { }

    /**
     * Throw an exception if SDK is not initialized
     */
    private static checkInitialized(): Promise<void>  {
        if (!this._initialized) {
            return Promise.reject(new Error("Kiln is not initialized."));
        }
    }

    /**
     * Initializes the SDK
     */
    public static init(): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.init();
        }
        else {
            if (this._initialized) {
                return Promise.reject(new Error("Kiln already initialized"));
            }

            return new Promise((resolve, reject) => {
                cc.resources.load("kiln/kilnSettings", (err, res: cc.JsonAsset) => {
                    if (err) {
                        cc.error("Error loading Kiln Settings");
                        reject(err);
                    }
                    else {
                        Kiln.EditorSettings = res.json;

                        this._initialized = true;
    
                        if (this.supportsLeaderboards()) {
                            Kiln.EditorSettings.leaderboards.forEach((l) => {
                                // KilnLeaderboard.reset(l.id);
                                const leaderboard = KilnLeaderboard.isSaved(l.id) ? KilnLeaderboard.load(l.id) : new KilnLeaderboard(l.id, 100, l.ascending);
                                this._leaderboards.set(l.id, leaderboard);
                            });
                        }
            
                        if (this.supportsIAP()) {
                            this._iap = new KilnInAppPurchases();
                        }
            
                        resolve();
                    }
                });
            });
        }
    }

    /**
     * Checks for Interstitial Ads support
     * @returns true if supported, false otherwise
     */
    public static supportsInterstitialAds(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.supportsInterstitialAds();
        }
        else {
            return Kiln.EditorSettings.supportsInterstitialsAds;
        }
    }

    /**
     * Checks for Rewarded Ads support
     * @returns true if supported, false otherwise
     */
    public static supportsRewardedAds(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.supportsRewardedAds();
        }
        else {
            return Kiln.EditorSettings.supportsRewardedAds;
        }
    }

    /**
     * Checks for Banner Ads support
     * @returns true if supported, false otherwise
     */
    public static supportsBannerAds(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.supportsBannerAds();
        }
        else {
            return Kiln.EditorSettings.supportsBannerAds;
        }
    }
    
    /**
     * Checks for In App Purchases support
     * @returns true if supported, false otherwise
     */
    public static supportsIAP(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.supportsIAP();
        }
        else {
            return Kiln.EditorSettings.supportsIAPs;
        }
    }

    /**
     * Checks for Leaderboards support
     * @returns true if supported, false otherwise
     */
    public static supportsLeaderboards(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.supportsLeaderboards();
        }
        else {
            return Kiln.EditorSettings.supportsLeaderboards;
        }
    }

    /**
     * Checks for Native Leaderboard UI support
     * @returns true if supported, false otherwise
     */
    public static supportsPlatformLeaderboardsUI(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.supportsPlatformLeaderboardsUI();
        }
        else {
            return Kiln.EditorSettings.supportsPlatformLeaderboardsUI;
        }
    }

    /**
     * Loads a Rewarded Ad. If the current platform doesn't support Rewarded Ads (see {@link supportsRewardedAds}), 
     * is provided with an invalid identifier or there's a problem loading the ad, it'll reject the Promise
     * @param identifier The Rewarded Ad identifier
     * @returns Promise
     */
    public static loadRewardedAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.loadRewardedAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsRewardedAds()) {
                    reject(new Error("Rewarded Ads not supported."));
                }
    
                if (Kiln.EditorSettings.rewarded.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Rewarded Placement ID: ${identifier}`));
                }

                if (this._rewardedAds.get(identifier) != null) {
                    reject(new Error(`Rewarded Placement ID: ${identifier} already loaded`));
                }
    
                cc.resources.load("kiln/prefabs/KilnRewardedAd", (err, res: cc.Prefab) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this._rewardedAds.set(identifier, cc.instantiate(res).getComponent("rewardedAdController"));

                        return resolve();
                    }
                });
            });
        }
    }

    /**
     * Shows a Rewarded Ad. If the platform doesn't support Rewarded Ads (see {@link supportsRewardedAds}), 
     * an invalid identifier is provided or the Rewarded Ad hasn't been loaded (see {@link loadRewardedAd}) 
     * it'll reject the Promise
     * @param identifier The Rewarded Ad identifier
     * @returns Promise
     */
    public static showRewardedAd(identifier: string): Promise<KilnRewardedAdResponse> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.showRewardedAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsRewardedAds()) {
                    reject(new Error("Rewarded Ads not supported."));
                }
    
                if (Kiln.EditorSettings.rewarded.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Rewarded Placement ID: ${identifier}`));
                }
    
                if (this._rewardedAds.get(identifier) == null) {
                    reject(new Error(`Rewarded Placement ID: ${identifier} not loaded`));
                }
                else {
                    this._rewardedAds.get(identifier).show(identifier, (r: KilnRewardedAdResponse) => { return resolve(r) });
                    this._rewardedAds.set(identifier, null);
                }
            });
        }
    }
    
    /**
     * Loads an Interstitial Ad. If the current platform doesn't support Interstitial Ads 
     * (see {@link supportsInterstitialAds}), is provided an invalid identifier or there's a 
     * problem loading the ad, it'll reject the Promise
     * @param identifier The Interstitial Ad identifier
     * @returns Promise
     */
    public static loadInterstitialAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.loadInterstitialdAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsInterstitialAds()) {
                    reject(new Error("Interstitial Ads not supported."));
                }
    
                if (Kiln.EditorSettings.interstitials.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Interstitial Placement ID: ${identifier}`));
                }

                if (this._interstitialAds.get(identifier) != null) {
                    reject(new Error(`Interstitial Placement ID: ${identifier} already loaded`));
                }
    
                cc.resources.load("kiln/prefabs/KilnInterstitialAd", (err, res: cc.Prefab) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this._interstitialAds.set(identifier, cc.instantiate(res).getComponent("interstitialAdController"));

                        return resolve();
                    }
                });
            });
        }
    }

    /**
     * Shows an Interstitial Ad. If the platform doesn't support Interstitial Ads 
     * (see {@link supportsInterstitialAds}), an invalid identifier is provided or the 
     * Interstitial Ad is not loaded (see {@link loadInterstitialAd}), 
     * it'll reject the Promise
     * @param identifier The Interstitial Ad identifier
     * @returns Promise
     */
    public static showInterstitialAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.showInterstitialAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsInterstitialAds()) {
                    reject(new Error("Interstitial Ads not supported."));
                }
    
                if (Kiln.EditorSettings.interstitials.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Interstitial Placement ID: ${identifier}`));
                }
    
                if (this._interstitialAds.get(identifier) == null) {
                    reject(new Error(`Interstitial Placement ID: ${identifier} not loaded`));
                }
                else {
                    this._interstitialAds.get(identifier).show(identifier, () => { return resolve() });
                    this._interstitialAds.set(identifier, null);
                }
            });
        }
    }

    /**
     * Loads a Banner Ad. If the current platform doesn't support Banner Ads 
     * (see {@link supportsBannerAds}), the provided identifier is invalid or the Banner Ad 
     * has already been loaded the Task will get an Exception
     * @param identifier The Banner Ad identifier
     * @param position Where in the screen to position the Banner Ad. See {@link KilnBannerPosition}
     * @param maxSize The maximum size of the Banner Ad to load. See {@link KilnBannerSize}
     * @returns Promise
     */
    public static loadBannerAd(identifier: string, position: KilnBannerPosition, maxSize: KilnBannerSize = KilnBannerSize.Width320Height50): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.loadBannerAd(identifier, position, maxSize);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Banner Placement ID: ${identifier}`));
                }

                if (this._bannerAds.get(identifier) != null) {
                    reject(new Error(`Banner Placement ID: ${identifier} already loaded`));
                }
    
                cc.resources.load("kiln/prefabs/KilnBannerAd", (err, res: cc.Prefab) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this._bannerAds.set(identifier, cc.instantiate(res).getComponent("bannerAdController"));
                        this._bannerAds.get(identifier).configure(identifier, position, maxSize);

                        return resolve();
                    }
                });
            });
        }
    }

    /**
     * Shows a Banner Ad. If the platform doesn't support Banner Ads (see {@link supportsBannerAds}), 
     * an invalid identifier is provided or the Banner Ad is not loaded (see {@link loadBannerAd}, 
     * {@link KilnBannerPosition}, {@link KilnBannerSize})), it'll reject the Promise
     * @param identifier The Banner Ad identifier
     * @returns Promise
     */
    public static showBannerAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.showBannerAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Banner Placement ID: ${identifier}`));
                }
    
                if (this._bannerAds.get(identifier) == null) {
                    reject(new Error(`Banner Placement ID: ${identifier} not loaded`));
                }
                else {
                    this._bannerAds.get(identifier).showBanner();

                    return resolve();
                }
            });
        }
    }

    /**
     * Hides a Banner Ad. If the platform doesn't support Banner Ads (see {@link supportsBannerAds}), 
     * an invalid Banner id is provided, or the Banner Ad has not been previously loaded 
     * (see {@link loadBannerAd}, {@link KilnBannerPosition}, {@link KilnBannerSize})) it'll reject the Promise
     * @param identifier The Banner Ad identifier
     * @returns Promise
     */
    public static hideBannerAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.hideBannerAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Banner Placement ID: ${identifier}`));
                }
    
                if (this._bannerAds.get(identifier) == null) {
                    reject(new Error(`Banner Placement ID: ${identifier} not loaded`));
                }
                else {
                    this._bannerAds.get(identifier).hideBanner();

                    return resolve();
                }
            });
        }
     }
    
    /**
     * It destroys the banner ad. If the platform doesn't support banner ads 
     * (see {@link supportsBannerAds}), the identifier is invalid or the banner hasn't 
     * been previously loaded (see {@link loadBannerAd}) 
     * it'll reject the Promise.
     * @param identifier The Banner Ad identifier
     * @returns Promise
     */
    public static destroyBannerAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.destroyBannerAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
                    reject(new Error(`Invalid Banner Placement ID: ${identifier}`));
                }
    
                if (this._bannerAds.get(identifier) == null) {
                    reject(new Error(`Banner Placement ID: ${identifier} not loaded`));
                }
                else {
                    this._bannerAds.get(identifier).destroyBanner();
                    this._bannerAds.set(identifier, null);

                    return resolve();
                }
            });
        }
    }

    /**
     * Retrieves a list of available for purcharse Product. If the platform doesn't 
     * support In App Purchases ({@link supportsIAP}) it'll reject the Promise
     * @param ids List of ids of products to retrieve. Optional parameter, will retrieve all if not provided.  
     * @returns Promise
     */
    public static getAvailableProducts(ids?: Array<string>): Promise<Array<IKilnProduct>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if (ids == null) {
                return Kiln.Bridge.getAvailableProducts();   
            }
            else {
                return Kiln.Bridge.getAvailableProductsFromList(ids);
            }
        }
        else {
            this.checkInitialized();

            return new Promise<Array<IKilnProduct>>((resolve, reject) => {
                if (!this.supportsIAP()) {
                    reject(new Error("In App Purchases not supported."));
                }

                return resolve(this._iap.products);
            });
        }
    }

    /**
     * Retrieves a list of active Purchases. By active we mean that they are either for Non 
     * Consumables Products, or Consumables Products that have not been 
     * consumed yet. If the platform doesn't support In App Purchases (see {@link supportsIAP}) 
     * it'll reject the Promise
     * @returns Promise
     */
    public static getPurchases(): Promise<Array<IKilnPurchase>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.getPurchases();
        }
        else {
            this.checkInitialized();
            
            return new Promise<Array<IKilnPurchase>>((resolve, reject) => {
                if (!this.supportsIAP()) {
                    reject(new Error("In App Purchases not supported."));
                }
                
                return resolve(this._iap.nonConsumedPurchases);
            });
        }
    }

    /**
     * Launches the purchase flow of a Product. If the platform doesn't support In 
     * App Purchases (see {@link supportsIAP}) it'll reject the Promise
     * @param productId Identifier of the Product to be purchased
     * @param payload Additional data to send with the purchase
     * @returns Promise
     */
    public static purchaseProduct(productId: string, payload: string): Promise<IKilnPurchase> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.purchaseProduct(productId, payload);
        }
        else {
            this.checkInitialized();

            if (!this.supportsIAP()) {
                return Promise.reject(new Error("In App Purchases not supported."));
            }

            return this._iap.purchaseProduct(productId, payload);
        }
    }

    /**
     * It consumes an already purchased consumable product. If the platform doesn't 
     * support purchases it'll reject the Promise
     * @param purchaseToken Token associated with the Purchase
     * @returns Promise
     */
    public static consumePurchasedProduct(purchaseToken: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.consumePurchasedProduct(purchaseToken);
        }
        else {
            this.checkInitialized();

            if (!this.supportsIAP()) {
                Promise.reject(new Error("In App Purchases not supported."));
            }

            return this._iap.consumePurchasedProduct(purchaseToken);
        }
    }

    /**
     * Retrieves the current Player's LeaderboardEntry. If the platform doesn't support 
     * Leaderboards the Task (see {@link supportsLeaderboards}) it'll reject the Promise
     * @param leaderboardId The Leaderboard identifier
     * @returns Promise
     */
    public static getUserScore(leaderboardId: string): Promise<IKilnLeaderboardEntry> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.getUserScore(leaderboardId);
        }
        else {
            this.checkInitialized();

            return new Promise((resolve, reject) => {
                if (!this.supportsLeaderboards()) {
                    return reject(new Error("Leaderboards not supported."));
                }
    
                if (!this._leaderboards.has(leaderboardId)) {
                    return reject(new Error(`There's no Leaderboards with id ${leaderboardId}.`));
                }

                return resolve(this._leaderboards.get(leaderboardId).getUserScore());
            });
        }
    }

    /**
     * Sets the current Player's score. If the platform doesn't support Leaderboards 
     * (see {@link supportsLeaderboards}) it'll reject the Promise
     * @param leaderboardId Leaderboard identifier
     * @param score Score to set
     * @param data (Optional) If the platform supports it, additional data to set.
     * @returns Promise
     */
    public static setUserScore(leaderboardId: string, score: number, data?: object): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.setUserScore(leaderboardId, score, data);
        }
        else {
            this.checkInitialized();

            return new Promise((resolve, reject) => {
                if (!this.supportsLeaderboards()) {
                    return reject(new Error("Leaderboards not supported."));
                }

                if (!this._leaderboards.has(leaderboardId)) {
                    return reject(new Error(`There's no Leaderboards with id ${leaderboardId}.`));
                }

                if (!score) {
                    return reject(new Error("No score provided."));
                }

                this._leaderboards.get(leaderboardId).setUserScore(score, data);

                return resolve();
            });
        }
    }

    /**
     * Retrieves a list of LeaderboardEntry for all players. If the platform doesn't 
     * support leaderboards (see {@link supportsLeaderboards}) it'll reject the Promise
     * @param leaderboardId Leaderboard identifier
     * @param amount Amount of LeaderboardEntry to retrieve
     * @param offset Offset from the top of the Leaderboard that LeaderboardEntry will be fetched from
     * @returns Promise
     */
    public static getScores(leaderboardId: string, amount: number = 10, offset: number = 0): Promise<Array<IKilnLeaderboardEntry>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.getScores(leaderboardId, amount, offset);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsLeaderboards()) {
                    return reject(new Error("Leaderboards not supported."));
                }

                if (!this._leaderboards.has(leaderboardId)) {
                    return reject(new Error(`There's no Leaderboards with id ${leaderboardId}.`));
                }

                return resolve(this._leaderboards.get(leaderboardId).getScores(amount, offset));
            });
        }
    }

    /**
     * Shows native Leaderboard UI if supported (see {@link supportsPlatformLeaderboardUI}). 
     * Otherwise reject the Promise
     * @returns Promise
     */
    public static showPlatformLeaderboardUI(): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.showPlatformLeaderboardUI();
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsPlatformLeaderboardsUI()) {
                    return reject(new Error("Platform Leaderboard UI not supported."));
                }

                cc.resources.load("kiln/prefabs/KilnPlatformLeaderboard", (err, res: cc.Prefab) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const platformLeaderboards: KilnPlatformLeaderboardController = cc.instantiate(res).getComponent("platformLeaderboardController")
                        platformLeaderboards.show(() => { return resolve(); });
                    }
                });
            });
        }
    }

    
    /**
     * Sends an Analytics Event.
     * @param eventId The Event identifier
     * @return Promise
     */
    public static submitAnalyticsEvent(eventId: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return Kiln.Bridge.submitAnalyticsEvent(eventId);
        }
        else {
            return Promise.resolve();
        }
    }
}

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

export enum KilnProductType
{
    Consumable, NonConsumable
}
    
export interface IKilnProduct {
    getProductID: () => string,
    getPrice: () => string,
    getProductType: () => KilnProductType,
    getDescription: () => string,
    getImageURI: () => string,
    getPriceCurrencyCode: () => string,
    toString: () => string
}

export interface IKilnPurchase {
    getDeveloperPayload: () => string,
    getProductId: () => string,
    getPurchaseToken: () => string,
    getPurchaseTime: () => string,
    getSignedRequest: () => string,
    toString: () => string
}

export interface IKilnLeaderboardEntry {
    getScore: () => number,
    getRank: () => number,
    getPlayer: () => IKilnPlayer,
    toString: () => string,
}

export interface IKilnPlayer {
    getId: () => string,
    getName: () => string,
    getPhotoURL: () => string,
}

interface KilnLeaderboardSetting {
    id: string,
    ascending: boolean
}

interface KilnIAP {
    id: string,
    consumable: boolean,
    price: string,
    description: string,
    imageURI: string,
    currencyCode: string
}

/**
 * @internal
 */ 
export interface KilnSettings {
    supportsInterstitialsAds: boolean,
    supportsRewardedAds: boolean,
    supportsBannerAds: boolean,
    supportsLeaderboards: boolean,
    supportsPlatformLeaderboardsUI: boolean,
    supportsIAPs: boolean,
    interstitials: Array<string>,
    banners: Array<string>,
    rewarded: Array<string>,
    events: Array<string>,
    leaderboards: Array<KilnLeaderboardSetting>,
    iaps: Array<KilnIAP>
}