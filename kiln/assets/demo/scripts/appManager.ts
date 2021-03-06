import { IKilnProduct, IKilnPurchase, KilnBannerPosition, KilnBannerSize } from "../../sdk/api";
import KilnIdSelector from "../../sdk/mock-platform/scripts/idSelector";
import Logger from "./logger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AppManager extends cc.Component {

    @property(cc.Node)
    idSelectorNode: cc.Node = null;
        
    @property(cc.Node)
    initButton: cc.Node = null;

    @property(cc.Node)
    consoleNode: cc.Node = null;

    @property(cc.Node)
    sectionsButtons: cc.Node = null;

    @property(cc.Node)
    adsSection: cc.Node = null;

    @property(cc.Node)
    leaderboardsSection: cc.Node = null;

    @property(cc.Node)
    iapSection: cc.Node = null;

    @property(cc.Node)
    analyticsSection: cc.Node = null;

    private _currentSection: cc.Node;
    private _idSelector: KilnIdSelector;
    private _logger: Logger;

    private _scoreToSubmit: number;
    private _getScoresAmount: number;
    private _getScoresOffset: number;
    

    public start() {
        this._idSelector = this.idSelectorNode.getComponent("idSelector");
        this._logger = this.consoleNode.getComponent("logger");

        // When deploying on a device Kiln.EditorSettings shouldn't be used. It won't be initialized by the SDK,
        // because it's purpose is for mocking behaviors in the Editor. The user should keep the ids for leaderboards,
        // ads, iaps, etc however they prefer, in a structure of their own.
        // This demo app relies on Kiln.EditorSettings to work, so we'll manually initialize it here in case this is running
        // on a device.
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            cc.resources.load("kiln/kilnSettings", (err, res: cc.JsonAsset) => {
                if (err) {
                    console.error("Error loading Kiln Settings");
                    console.error(err);
                }
                else {
                    Kiln.EditorSettings = res.json;
                }
            });
        }
    }

    /**
     * 
     * @param section 
     */
    private enableSection(section: cc.Node ) {
        if (this._currentSection != null) {
            this._currentSection.active = false;
        }

        section.active = true;

        this._currentSection = section;
    }

    
    /**
     * 
     * @param emumType 
     * @returns 
     */
    private enumToArray(emumType: any): Array<string> {
        const filter = (value: any) => isNaN(Number(value)) === false;
        return Object.keys(emumType).filter(filter).map(key => emumType[key]);
    }

    /**
     * 
     * @param n 
     */
    public SetScoreToSubmit(n: string) {
        this._scoreToSubmit = parseFloat(n);
    }

    /**
     * 
     * @param n 
     */
     public SetGetScoresAmount(n: string) {
        this._getScoresAmount = parseInt(n);
     }
    
    /**
     * 
     * @param n 
     */
     public SetGetScoresOffset(n: string) {
        this._getScoresOffset = parseInt(n);
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onInitButton(event: cc.Component.EventHandler, customEventData: string) {
        try {
            await Kiln.API.init();

            this._logger.log("Kiln Initialized");

            this.initButton.active = false;
            this.sectionsButtons.active = true;
        }
        catch (ex) {
            this._logger.error("Error Initializing Kiln");
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     * @returns 
     */
    public onAdvertisementSectionButton(event: cc.Component.EventHandler, customEventData: string) {
        if (!Kiln.API.supportsInterstitialAds() && !Kiln.API.supportsRewardedAds() && !Kiln.API.supportsBannerAds()) {
            this._logger.warn("No Ads Type Supported.");
        }

        this.enableSection(this.adsSection);
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     * @returns 
     */
    public onIAPSectionButton(event: cc.Component.EventHandler, customEventData: string) {
        if (!Kiln.API.supportsIAP()) {
            this._logger.warn("In App Purchases are not supported.");
        }

        this.enableSection(this.iapSection);
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     * @returns 
     */
    public onLeaderboardsSectionButton(event: cc.Component.EventHandler, customEventData: string) {
        if (!Kiln.API.supportsLeaderboards()) {
            this._logger.warn("Leaderboards are not supported.");
        }

        this.enableSection(this.leaderboardsSection);
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public onAnalyticsSectionButton(event: cc.Component.EventHandler, customEventData: string) {
        this.enableSection(this.analyticsSection);
    }

    
    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onLoadRewardedAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";

        try {
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.rewarded);
            
            await Kiln.API.loadRewardedAd(placementId);

            this._logger.log(`Rewarded Ad '${placementId}' Loaded`);
        }
        catch (ex) {
            this._logger.error(`Error Loading Rewarded Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onShowRewardedAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";

        try {
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.rewarded);

            let result = await Kiln.API.showRewardedAd(placementId);

            this._logger.log(`Rewarded Ad '${placementId}' displayed. Should reward: ${result.withReward}`);
        }
        catch (ex) {
            this._logger.error(`Error Displaying Rewarded Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
     public async onLoadInterstitialAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";

        try {
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.interstitials);
             
            await Kiln.API.loadInterstitialAd(placementId);

            this._logger.log(`Interstitial Ad '${placementId}' Loaded`);
        }
        catch (ex) {
            this._logger.error(`Error Loading Interstitial Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onShowInterstitialAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";

        try {
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.interstitials);

            await Kiln.API.showInterstitialAd(placementId);

            this._logger.log(`Interstitial Ad '${placementId}' displayed`);
        }
        catch (ex) {
            this._logger.error(`Error Displaying Interstitial Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onLoadBannerAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";
        let position = KilnBannerPosition.BottomCenter;
        let maxSize = KilnBannerSize.Width320Height50;

        try {
            // Select a Placement Id
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.banners);
            
            // Choose an alignment
            let enumKeys = this.enumToArray(KilnBannerPosition)
            let positionString = await this._idSelector.selectID(enumKeys);
            position = KilnBannerPosition[positionString];

            // Select a banner maximum size
            enumKeys = this.enumToArray(KilnBannerSize)
            let bannerSizeString = await this._idSelector.selectID(enumKeys);
            maxSize = KilnBannerSize[bannerSizeString];

            await Kiln.API.loadBannerAd(placementId, position, maxSize);

            this._logger.log(`Banner Ad '${placementId}' Loaded`);
        }
        catch (ex) {
            this._logger.error(`Error Loading Banner Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onShowBannerAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";

        try {
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.banners);

            await Kiln.API.showBannerAd(placementId);

            this._logger.log(`Banner Ad '${placementId}' displayed`);
        }
        catch (ex) {
            this._logger.error(`Error Displaying Banner Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onHideBannerAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";

        try {
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.banners);

            await Kiln.API.hideBannerAd(placementId);

            this._logger.log(`Banner Ad '${placementId}' hidden`);
        }
        catch (ex) {
            this._logger.error(`Error Hiding Banner Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onDestroyBannerAdButton(event: cc.Component.EventHandler, customEventData: string) {
        let placementId = "";

        try {
            placementId = await this._idSelector.selectID(Kiln.EditorSettings.banners);

            await Kiln.API.destroyBannerAd(placementId);

            this._logger.log(`Banner Ad '${placementId}' destroyed`);
        }
        catch (ex) {
            this._logger.error(`Error Destroying Banner Ad '${placementId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onGetAvailablePurchasesButton(event: cc.Component.EventHandler, customEventData: string) {
        try {
            let products = await Kiln.API.getAvailableProducts();

            products.forEach((p: IKilnProduct) => this._logger.log(p.toString()));
        }
        catch (ex) {
            this._logger.error(`Error Retrieving Available Products'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onGetPurchasesButton(event: cc.Component.EventHandler, customEventData: string) {
        try {
            let purchases = await Kiln.API.getPurchases();
            
            purchases.forEach((p: IKilnPurchase) => this._logger.log(p.toString()));
        }
        catch (ex) {
            this._logger.error(`Error Retrieving Active Purchases'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onPurchaseProductButton(event: cc.Component.EventHandler, customEventData: string) {
        let productId = "";

        try {
            productId = await this._idSelector.selectID(Kiln.EditorSettings.iaps.map(iap => iap.id));

            let purchase = await Kiln.API.purchaseProduct(productId, "DEVELOPER PAYLOAD TEST");

            this._logger.log(`Product ${purchase.getProductId()} ready for consumption`);
        }
        catch (ex) {
            this._logger.error(`Error Purchasing Product '${productId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onConsumeProductButton(event: cc.Component.EventHandler, customEventData: string) {
        let purchaseToken = "";

        try {
            purchaseToken = await this._idSelector.selectID((await Kiln.API.getPurchases()).map(purchase => purchase.getPurchaseToken()));

            await Kiln.API.consumePurchasedProduct(purchaseToken);

            this._logger.log(`Product with purchas toke ${purchaseToken} consumed`);
        }
        catch (ex) {
            this._logger.error(`Error Consuming Purchase '${purchaseToken}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onSetUserScoreButton(event: cc.Component.EventHandler, customEventData: string) {
        let leaderboardId = "";
        
        try {
            leaderboardId = await this._idSelector.selectID(Kiln.EditorSettings.leaderboards.map(l => l.id));

            await Kiln.API.setUserScore(leaderboardId, this._scoreToSubmit);

            this._logger.log("User score submitted successfully");
        }
        catch (ex) {
            this._logger.error(`Error Submiting Score for Leaderboard '${leaderboardId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onGetUserScoreButton(event: cc.Component.EventHandler, customEventData: string) {
        let leaderboardId = "";
        
        try {
            leaderboardId = await this._idSelector.selectID(Kiln.EditorSettings.leaderboards.map(l => l.id));

            let leaderboardEntry = await Kiln.API.getUserScore(leaderboardId);

            this._logger.log(leaderboardEntry.toString());
        }
        catch (ex) {
            this._logger.error(`Error Retrieving Score for Leaderboard '${leaderboardId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onGetScoresButton(event: cc.Component.EventHandler, customEventData: string) {
        let leaderboardId = "";
        
        try {
            leaderboardId = await this._idSelector.selectID(Kiln.EditorSettings.leaderboards.map(l => l.id));

            let leaderboardEntry = await Kiln.API.getScores(leaderboardId, this._getScoresAmount, this._getScoresOffset);

            this._logger.log(leaderboardEntry.toString());
        }
        catch (ex) {
            this._logger.error(`Error Retrieving Scores for Leaderboard '${leaderboardId}'`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onShowPlatformLeaderboardUIButton(event: cc.Component.EventHandler, customEventData: string) {
        try {
            await Kiln.API.showPlatformLeaderboardUI();
        }
        catch (ex) {
            this._logger.error(`Error Displaying Platform Leaderboards`);
            this._logger.error((ex as Error).message);
        }
    }

    /**
     * 
     * @param event 
     * @param customEventData 
     */
    public async onAnalyticsEventButton(event: cc.Component.EventHandler, customEventData: string) {
        let eventId = "";

        try {
            eventId = await this._idSelector.selectID(Kiln.EditorSettings.events);

            await Kiln.API.submitAnalyticsEvent(eventId);

            this._logger.log("Analytics Event Fired.");
        }
        catch (ex) {
            this._logger.error(`Error Submitting Analytics Event '${eventId}'`);
            this._logger.error((ex as Error).message);
        }
    }

}
