import { ILeaderboardEntry, IProduct, IPurchase, KilnBannerPosition, KilnBannerSize, KilnRewardedAdResponse } from "./bridge";

interface KilnLeaderboard {
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
    leaderboards: Array<KilnLeaderboard>,
    iaps: Array<KilnIAP>
}

export class KilnAPI {
    public static settings: KilnSettings;

    /**
     * Initializes the SDK
     */
    public static init(): Promise<void> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.init();
        }
        else {
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
            return this.settings.supportsInterstitialsAds;
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
            return this.settings.supportsRewardedAds;
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
            return this.settings.supportsBannerAds;
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
            return this.settings.supportsIAPs;
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
            return this.settings.supportsLeaderboards;
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
            return this.settings.supportsPlatformLeaderboardsUI;
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
            // return true;
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
            // return true;
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
            // return true;
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
            // return true;
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
            // return true;
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
            // return true;
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
            // return true;
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
            // return true;
        }
    }

    /**
     * Retrieves a list of available for purcharse Product. If the platform doesn't 
     * support In App Purchases (see SupportsIAP()) it'll reject the Promise
     * @param ids List of ids of products to retrieve. Optional parameter, will retrieve all if not provided.  
     * @returns Promise
     */
    public static getAvailableProducts(ids?: Array<string>): Promise<Array<IProduct>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            if (ids == null) {
                return cc.Kiln.Bridge.getAvailableProducts();   
            }
            else {
                return cc.Kiln.Bridge.getAvailableProductsFromList(ids);
            }
        }
        else {
            // return true;
        }
    }

    /**
     * Retrieves a list of active Purchases. By active we mean that they are either for Non 
     * Consumables Products, or Consumables Products that have not been 
     * consumed yet. If the platform doesn't support In App Purchases (see SupportsIAP()) 
     * it'll reject the Promise
     * @returns Promise
     */
    public static getPurchases(): Promise<Array<IPurchase>> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.getPurchases();
        }
        else {
            // return true;
        }
    }

    /**
     * Launches the purchase flow of a Product. If the platform doesn't support In 
     * App Purchases (check SupportsIAP()) it'll reject the Promise
     * @param productId Identifier of the Product to be purchased
     * @param payload Additional data to send with the purchase
     * @returns Promise
     */
    public static purchaseProduct(productId: string, payload: string): Promise<IPurchase> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.purchaseProduct(productId, payload);
        }
        else {
            // return true;
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
            // return true;
        }
    }

    /**
     * Retrieves the current Player's LeaderboardEntry. If the platform doesn't support 
     * Leaderboards the Task (check SupportsLeaderboards()) it'll reject the Promise
     * @param leaderboardId The Leaderboard identifier
     * @returns Promise
     */
    public static getUserScore(leaderboardId: string): Promise<ILeaderboardEntry> {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.getUserScore(leaderboardId);
        }
        else {
            // return true;
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
            // return true;
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
    public static getScores(leaderboardId: string, amount: number, offset: number) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            return cc.Kiln.Bridge.getScores(leaderboardId, amount, offset);
        }
        else {
            // return true;
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
            // return true;
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
            // return true;
        }
    }
}
