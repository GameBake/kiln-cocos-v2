import { IProduct, IPurchase, KilnBannerPosition, KilnBannerSize } from "../../sdk/bridge";
import IdSelector from "../../sdk/mock-platform/scripts/idSelector";
import logger from "./logger";

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
    private _idSelector: IdSelector;
    private _logger: logger;

    private _scoreToSubmit: number;
    private _getScoresAmount: number;
    private _getScoresOffset: number;
    

    public start() {
        this._idSelector = this.idSelectorNode.getComponent("idSelector");
        this._logger = this.consoleNode.getComponent("logger");
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
            await cc.Kiln.API.init();

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
        if (!cc.Kiln.API.supportsInterstitialAds() && !cc.Kiln.API.supportsRewardedAds() && !cc.Kiln.API.supportsBannerAds()) {
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
        if (!cc.Kiln.API.supportsIAP()) {
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
        if (!cc.Kiln.API.supportsLeaderboards()) {
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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.rewarded);
            
            await cc.Kiln.API.loadRewardedAd(placementId);

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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.rewarded);

            let result = await cc.Kiln.API.showRewardedAd(placementId);

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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.interstitials);
             
            await cc.Kiln.API.loadInterstitialAd(placementId);

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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.interstitials);

            await cc.Kiln.API.showInterstitialAd(placementId);

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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.banners);
            
            // Choose an alignment
            let enumKeys = this.enumToArray(KilnBannerPosition)
            let positionString = await this._idSelector.selectID(enumKeys);
            position = KilnBannerPosition[positionString];

            // Select a banner maximum size
            enumKeys = this.enumToArray(KilnBannerSize)
            let bannerSizeString = await this._idSelector.selectID(enumKeys);
            maxSize = KilnBannerSize[bannerSizeString];

            await cc.Kiln.API.loadBannerAd(placementId, position, maxSize);

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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.banners);

            await cc.Kiln.API.showBannerAd(placementId);

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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.banners);

            await cc.Kiln.API.hideBannerAd(placementId);

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
            placementId = await this._idSelector.selectID(cc.Kiln.EditorSettings.banners);

            await cc.Kiln.API.destroyBannerAd(placementId);

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
            let products = await cc.Kiln.API.getAvailableProducts();

            products.forEach((p: IProduct) => this._logger.log(p.toString()));
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
            let purchases = await cc.Kiln.API.getPurchases();

            purchases.forEach((p: IPurchase) => this._logger.log(p.toString()));
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
            productId = await this._idSelector.selectID(cc.Kiln.EditorSettings.iaps.map(iap => iap.id));

            let purchase = await cc.Kiln.API.purchaseProduct(productId, "DEVELOPER PAYLOAD TEST");

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
            purchaseToken = await this._idSelector.selectID((await cc.Kiln.API.getPurchases()).map(purchase => purchase.getPurchaseToken()));

            await cc.Kiln.API.consumePurchasedProduct(purchaseToken);

            this._logger.log(`Product with purchas toke ${purchaseToken} consumed`);
        }
        catch (ex) {
            this._logger.error(`Error Consuming Purhcase '${purchaseToken}'`);
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
            leaderboardId = await this._idSelector.selectID(cc.Kiln.EditorSettings.leaderboards.map(l => l.id));

            await cc.Kiln.API.setUserScore(leaderboardId, this._scoreToSubmit);

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
            leaderboardId = await this._idSelector.selectID(cc.Kiln.EditorSettings.leaderboards.map(l => l.id));

            let leaderboardEntry = await cc.Kiln.API.getUserScore(leaderboardId);

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
            leaderboardId = await this._idSelector.selectID(cc.Kiln.EditorSettings.leaderboards.map(l => l.id));

            let leaderboardEntry = await cc.Kiln.API.getScores(leaderboardId, this._getScoresAmount, this._getScoresOffset);

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
            await cc.Kiln.API.showPlatformLeaderboardUI();
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
            eventId = await this._idSelector.selectID(cc.Kiln.EditorSettings.events);

            await cc.Kiln.API.submitAnalyticsEvent(eventId);

            this._logger.log("Analytics Event Fired.");
        }
        catch (ex) {
            this._logger.error(`Error Submitting Analytics Event '${eventId}'`);
            this._logger.error((ex as Error).message);
        }
    }

}
