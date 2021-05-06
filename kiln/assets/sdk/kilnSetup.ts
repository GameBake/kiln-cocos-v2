import { KilnSettings, KilnAPI } from "./api";
import { KilnRewardedAdResponse, KilnBridge, IProduct, IPurchase, ILeaderboardEntry } from "./bridge";

interface KilnCallbacks {
    // Init
    onInitSuccess: () => void,
    onInitFailure: (e: Error) => void,

    // Rewarded Ads
    onLoadRewardedAdSuccess: () => void,
    onLoadRewardedAdFailure: (e: Error) => void,
    onShowRewardedAdSuccess: (response: KilnRewardedAdResponse) => void,
    onShowRewardedAdFailure: (e: Error) => void,

    // Interstitial Ads 
    onLoadInterstitialAdSuccess: () => void,
    onLoadInterstitialAdFailure: (e: Error) => void,
    onShowInterstitialAdSuccess: () => void,
    onShowInterstitialAdFailure: (e: Error) => void,

    // Banner Ads 
    onLoadBannerAdSuccess: () => void,
    onLoadBannerAdFailure: (e: Error) => void,
    onShowBannerAdSuccess: () => void,
    onShowBannerAdFailure: (e: Error) => void,
    onHideBannerAdSuccess: () => void,
    onHideBannerAdFailure: (e: Error) => void,
    onDestroyBannerAdSuccess: () => void,
    onDestroyBannerAdFailure: (e: Error) => void,

    // In App Purchases
    onGetAvailableProductsSuccess: (products: Array<IProduct>) => void,
    onGetAvailableProductsFailure: (e: Error) => void,
    onGetPurchasesSuccess: (purchases: Array<IPurchase>) => void,
    onGetPurchasesFailure: (e: Error) => void,
    onPurchaseProductSuccess: (purchase: IPurchase) => void,
    onPurchaseProductFailure: (e: Error) => void,
    onConsumePurchasedProductSuccess: () => void,
    onConsumePurchasedProductFailure: (e: Error) => void,

    // Leaderboards
    onGetUserScoreSuccess: (l: ILeaderboardEntry) => void,
    onGetUserScoreFailure: (e: Error) => void,
    onSetUserScoreSuccess: () => void,
    onSetUserScoreFailure: (e: Error) => void,
    onGetScoresSuccess: (s: Array<ILeaderboardEntry>) => void,
    onGetScoresFailure: (e: Error) => void,
    onShowPlatformLeaderboardUISuccess: () => void,
    onShowPlatformLeaderboardUIFailure: (e: Error) => void,
    
    // Analytics
    onSubmitAnalyticsEventSuccess: () => void,
    onSubmitAnalyticsEventFailure: (e: Error) => void
}

interface KilnSetup {
    API: typeof KilnAPI,
    Bridge: typeof KilnBridge,
    Callbacks: KilnCallbacks,
    EditorSettings: KilnSettings
}

declare global {
    namespace cc {
        let Kiln: KilnSetup;
    }
}

cc.Kiln = {
    API: KilnAPI,
    Bridge: KilnBridge,
    Callbacks: {} as KilnCallbacks,
    EditorSettings: {} as KilnSettings
}

cc.resources.load("kiln/kilnSettings", (err, res: cc.JsonAsset) => {
    if (err) {
        cc.error("Error loading Kiln Settings");
        cc.error(err);
    }
    else {
        cc.Kiln.EditorSettings = res.json;
    }
});