import { IKilnLeaderboardEntry, IKilnProduct, IKilnPurchase, KilnBannerPosition, KilnBannerSize, KilnRewardedAdResponse } from "./bridge";
import KilnBannerAdController from "./mock-platform/scripts/bannerAdController";
import KilnInAppPurchases from "./mock-platform/scripts/inAppPurchases";
import KilnInterstitialAdController from "./mock-platform/scripts/interstitialAdController";
import KilnLeaderboard from "./mock-platform/scripts/leaderboard";
import PlatformLeaderboardController from "./mock-platform/scripts/platformLeaderboardController";
import KilnRewardedAdController from "./mock-platform/scripts/rewardedAdController";

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

export class KilnAPI {

    private static _initialized: boolean = false;
    private static _interstitialAds: Map<string, KilnInterstitialAdController> = new Map<string, KilnInterstitialAdController>();
    private static _rewardedAds: Map<string, KilnRewardedAdController> = new Map<string, KilnRewardedAdController>();
    private static _bannerAds: Map<string, KilnBannerAdController> = new Map<string, KilnBannerAdController>();
    private static _leaderboards: Map<string, KilnLeaderboard> = new Map<string, KilnLeaderboard>();
    private static _iap: KilnInAppPurchases;
    // public static InAppPurchases IAP { get { return _iap; } }

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
            return cc.Kiln.Bridge.init();
        }
        else {
            if (this._initialized) {
                return Promise.reject(new Error("Kiln already initialized"));
            }

            this._initialized = true;

            if (this.supportsLeaderboards()) {
                cc.Kiln.EditorSettings.leaderboards.forEach((l) => {
                    // KilnLeaderboard.reset(l.id);
                    const leaderboard = KilnLeaderboard.isSaved(l.id) ? KilnLeaderboard.load(l.id) : new KilnLeaderboard(l.id, 100, l.ascending);
                    this._leaderboards.set(l.id, leaderboard);
                });
            }

            if (this.supportsIAP()) {
                this._iap = new KilnInAppPurchases();
            }

            return Promise.resolve();
        }
    }

    /**
     * Checks for Interstitial Ads support
     * @returns true if supported, false otherwise
     */
    public static supportsInterstitialAds(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.supportsInterstitialAds();
        }
        else {
            return cc.Kiln.EditorSettings.supportsInterstitialsAds;
        }
    }

    /**
     * Checks for Rewarded Ads support
     * @returns true if supported, false otherwise
     */
    public static supportsRewardedAds(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.supportsRewardedAds();
        }
        else {
            return cc.Kiln.EditorSettings.supportsRewardedAds;
        }
    }

    /**
     * Checks for Banner Ads support
     * @returns true if supported, false otherwise
     */
    public static supportsBannerAds(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.supportsBannerAds();
        }
        else {
            return cc.Kiln.EditorSettings.supportsBannerAds;
        }
    }
    
    /**
     * Checks for In App Purchases support
     * @returns true if supported, false otherwise
     */
    public static supportsIAP(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.supportsIAP();
        }
        else {
            return cc.Kiln.EditorSettings.supportsIAPs;
        }
    }

    /**
     * Checks for Leaderboards support
     * @returns true if supported, false otherwise
     */
    public static supportsLeaderboards(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.supportsLeaderboards();
        }
        else {
            return cc.Kiln.EditorSettings.supportsLeaderboards;
        }
    }

    /**
     * Checks for Native Leaderboard UI support
     * @returns true if supported, false otherwise
     */
    public static supportsPlatformLeaderboardsUI(): boolean {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.supportsPlatformLeaderboardsUI();
        }
        else {
            return cc.Kiln.EditorSettings.supportsPlatformLeaderboardsUI;
        }
    }

    /**
     * Loads a Rewarded Ad. If the current platform doesn't support Rewarded Ads (check SupportsRewardedAds()), 
     * is provided with an invalid identifier or there's a problem loading the ad, it'll reject the Promise
     * @param identifier The Rewarded Ad identifier
     * @returns Promise
     */
    public static loadRewardedAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.loadRewardedAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsRewardedAds()) {
                    reject(new Error("Rewarded Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.rewarded.indexOf(identifier) == -1) {
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
     * Shows a Rewarded Ad. If the platform doesn't support Rewarded Ads (check SupportsRewardedAds()), 
     * an invalid identifier is provided or the Rewarded Ad hasn't been loaded (check LoadRewardedAd(String)) 
     * it'll reject the Promise
     * @param identifier The Rewarded Ad identifier
     * @returns Promise
     */
    public static showRewardedAd(identifier: string): Promise<KilnRewardedAdResponse> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.showRewardedAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsRewardedAds()) {
                    reject(new Error("Rewarded Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.rewarded.indexOf(identifier) == -1) {
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
     * (check SupportsInterstitialAds()), is provided an invalid identifier or there's a 
     * problem loading the ad, it'll reject the Promise
     * @param identifier The Interstitial Ad identifier
     * @returns Promise
     */
    public static loadInterstitialAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.loadInterstitialdAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsInterstitialAds()) {
                    reject(new Error("Interstitial Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.interstitials.indexOf(identifier) == -1) {
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
     * (check SupportsInterstitialAds()), an invalid identifier is provided or the 
     * Interstitial Ad is not loaded (check LoadInterstitialAd(String)), 
     * it'll reject the Promise
     * @param identifier The Interstitial Ad identifier
     * @returns Promise
     */
    public static showInterstitialAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.showInterstitialAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsInterstitialAds()) {
                    reject(new Error("Interstitial Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.interstitials.indexOf(identifier) == -1) {
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
     * (check SupportsBannerAds()), the provided identifier is invalid or the Banner Ad 
     * has already been loaded the Task will get an Exception
     * @param identifier The Banner Ad identifier
     * @param position Where in the screen to position the Banner Ad. See BannerPosition
     * @param maxSize The maximum size of the Banner Ad to load. See BannerSize.
     * @returns Promise
     */
    public static loadBannerAd(identifier: string, position: KilnBannerPosition, maxSize: KilnBannerSize = KilnBannerSize.Width320Height50): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.loadBannerAd(identifier, position, maxSize);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
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
     * Shows a Banner Ad. If the platform doesn't support Banner Ads (check supportsBannerAds()), 
     * an invalid identifier is provided or the Banner Ad is not loaded (check loadBannerAd(string, 
     * BannerPosition, BannerSize)), it'll reject the Promise
     * @param identifier The Banner Ad identifier
     * @returns Promise
     */
    public static showBannerAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.showBannerAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
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
     * Hides a Banner Ad. If the platform doesn't support Banner Ads (check SupportsBannerAds()), 
     * an invalid Banner id is provided, or the Banner Ad has not been previously loaded 
     * (check LoadBannerAd(string, BannerPosition, BannerSize)) it'll reject the Promise
     * @param identifier The Banner Ad identifier
     * @returns Promise
     */
    public static hideBannerAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.hideBannerAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
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
     * (check SupportsBannerAds()), the identifier is invalid or the banner hasn't 
     * been previously loaded (check LoadBannerAd(string, BannerPosition, BannerSize)) 
     * it'll reject the Promise.
     * @param identifier The Banner Ad identifier
     * @returns Promise
     */
    public static destroyBannerAd(identifier: string): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.destroyBannerAd(identifier);
        }
        else {
            this.checkInitialized();
            
            return new Promise((resolve, reject) => {
                if (!this.supportsBannerAds()) {
                    reject(new Error("Banner Ads not supported."));
                }
    
                if (cc.Kiln.EditorSettings.banners.indexOf(identifier) == -1) {
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
     * support In App Purchases (see SupportsIAP()) it'll reject the Promise
     * @param ids List of ids of products to retrieve. Optional parameter, will retrieve all if not provided.  
     * @returns Promise
     */
    public static getAvailableProducts(ids?: Array<string>): Promise<Array<IKilnProduct>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if (ids == null) {
                return cc.Kiln.Bridge.getAvailableProducts();   
            }
            else {
                return cc.Kiln.Bridge.getAvailableProductsFromList(ids);
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
     * consumed yet. If the platform doesn't support In App Purchases (see SupportsIAP()) 
     * it'll reject the Promise
     * @returns Promise
     */
    public static getPurchases(): Promise<Array<IKilnPurchase>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.getPurchases();
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
     * App Purchases (check SupportsIAP()) it'll reject the Promise
     * @param productId Identifier of the Product to be purchased
     * @param payload Additional data to send with the purchase
     * @returns Promise
     */
    public static purchaseProduct(productId: string, payload: string): Promise<IKilnPurchase> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.purchaseProduct(productId, payload);
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
            return cc.Kiln.Bridge.consumePurchasedProduct(purchaseToken);
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
     * Leaderboards the Task (check SupportsLeaderboards()) it'll reject the Promise
     * @param leaderboardId The Leaderboard identifier
     * @returns Promise
     */
    public static getUserScore(leaderboardId: string): Promise<IKilnLeaderboardEntry> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.getUserScore(leaderboardId);
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
     * (check supportsLeaderboards() it'll reject the Promise
     * @param leaderboardId Leaderboard identifier
     * @param score Score to set
     * @param data (Optional) If the platform supports it, additional data to set.
     * @returns Promise
     */
    public static setUserScore(leaderboardId: string, score: number, data?: object): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.setUserScore(leaderboardId, score, data);
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
     * support leaderboards (check supportsLeaderboards()) it'll reject the Promise
     * @param leaderboardId Leaderboard identifier
     * @param amount Amount of LeaderboardEntry to retrieve
     * @param offset Offset from the top of the Leaderboard that LeaderboardEntry will be fetched from
     * @returns Promise
     */
    public static getScores(leaderboardId: string, amount: number = 10, offset: number = 0): Promise<Array<IKilnLeaderboardEntry>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.getScores(leaderboardId, amount, offset);
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
     * Shows native Leaderboard UI if supported (check supportsPlatformLeaderboardUI()). 
     * Otherwise reject the Promise
     * @returns Promise
     */
    public static showPlatformLeaderboardUI(): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.showPlatformLeaderboardUI();
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
                        const platformLeaderboards: PlatformLeaderboardController = cc.instantiate(res).getComponent("platformLeaderboardController")
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
            return cc.Kiln.Bridge.submitAnalyticsEvent(eventId);
        }
        else {
            return Promise.resolve();
        }
    }
}
