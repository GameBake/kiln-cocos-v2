var kilnSettings = {
    supportsInterstitialsAds: true,
    supportsRewardedAds: true,
    supportsBannerAds: true,
    supportsLeaderboards: true,
    supportsPlatformLeaderboardsUI: true,
    supportsIAPs: true,
    interstitials: [],
    banners: [],
    rewarded: [],
    events: [],
    leaderboards: [],
    iaps: []
};

const itemsHelper = {
    newAdPlacement: (options = {}) => {
        return `
            <div class="layout horizontal" id="ad-placement">
                <div class="flex-1 padded">
                    <input type="text" placeholder="Ad placement ID..." id="ad-placement-id" style="width: 100%" value="${options.id ? options.id : ""}" />
                </div>
                <div class="padded">
                    <ui-select id="ad-type">
                        <option value="REWARDED_VIDEO" ${(options.type && options.type == "REWARDED_VIDEO") ? "selected" : ""}>Rewarded Video</option>
                        <option value="INTERSTITIAL" ${(options.type && options.type == "INTERSTITIAL") ? "selected" : ""}>Interstitial</option>
                        <option value="BANNER" ${(options.type && options.type == "BANNER") ? "selected" : ""}>Banner</option>
                    </ui-select>
                </div>
                <div class="padded"><ui-button id="btn-delete-ad-placement">Delete</ui-button></div>
            </div>
        `;
    },
    newIAP: (options = {}) => {
        return `
            <div class="layout horizontal" id="iap">
                <div class="flex-1 padded">
                    <input type="text" placeholder="IAP ID..." id="iap-id" style="width: 100%" value="${options.id ? options.id : ""}" />
                </div>
                <div class="padded">
                    <ui-select id="iap-type">
                        <option value="NON_CONSUMABLE" ${!options.consumable ? "selected" : ""}>Non Consumable</option>
                        <option value="CONSUMABLE" ${options.consumable ? "selected" : ""}>Consumable</option>
                    </ui-select>
                </div>
                <div class="padded">
                    <input type="text" placeholder="Price..." id="iap-price" style="width: 100%" value="${options.price ? options.price : ""}" />
                </div>
                <div class="padded">
                    <input type="text" placeholder="Description..." id="iap-description" style="width: 100%" value="${options.description ? options.description : ""}" />
                </div>
                <div class="padded">
                    <input type="text" placeholder="Icon URI..." id="iap-icon-uri" style="width: 100%" value="${options.imageURI ? options.imageURI : ""}" />
                </div>
                <div class="padded">
                    <ui-select id="iap-currency-code">
                        <option value="GBP" ${(options.currencyCode && options.currencyCode == "GBP") ? "selected" : ""}>GBP</option>
                    </ui-select>
                </div>
                <div class="padded"><ui-button id="btn-delete-iap">Delete</ui-button></div>
            </div>
        `;
    },
    newLeaderboard: (options = {}) => {
        return `
            <div class="layout horizontal" id="leaderboard">
                <div class="flex-1 padded">
                    <input type="text" placeholder="Leaderboard ID..." id="leaderboard-id" style="width: 100%" value="${options.id ? options.id : ""}" />
                </div>
                <div class="padded">
                    <ui-select id="leaderboard-type">
                        <option value="LOW_TO_HIGH" ${options.ascending ? "selected" : ""}>Low to high</option>
                        <option value="HIGH_TO_LOW"${!options.ascending ? "selected" : ""}>High to low</option>
                    </ui-select>
                </div>
                <div class="padded"><ui-button id="btn-reset-leaderboard">Reset</ui-button></div>
                <div class="padded"><ui-button id="btn-delete-leaderboard">Delete</ui-button></div>
            </div>
        `;
    },
    newEvent: (options = {}) => {
        return `
            <div class="layout horizontal" id="event">
                <div class="flex-1 padded">
                    <input type="text" placeholder="Event ID..." id="event-id" style="width: 100%" value="${options.id ? options.id : ""}" />
                </div>
                <div class="padded"><ui-button id="btn-delete-event">Delete</ui-button></div>
            </div>
        `;
    },
}

var editorPanel = {
    style: `
        .padded {
            padding: 0 5px
        }

        ul {
            list-style-type: none;
        }

        div.main {
            height:100%;
            overflow: scroll;
        }

        input[type=text] {
            height: 22px;
            border-radius: 3px;
            border: 1px solid #171717;
            color: #FD942B;
            background-color: #262626;
            padding-left: 7px;
        }
        
        input[type=text]::-webkit-input-placeholder {
            color: #595959;
            font-style: italic;
        }

        input[type=text]:hover {
            border: 1px solid #BDBDBD;
        }
    `,

    template: `
        <div class="main">
            <ui-box-container style="margin: 5px;">
                <h3 class="padded">Supported Mock Features</h3>
                <ul>
                    <li><ui-checkbox id="supports-iaps" /> Supports In App Purchases</li>
                    <li><ui-checkbox id="supports-leaderboards" /> Supports Leaderboards</li>
                    <li><ui-checkbox id="supports-rewarded-ads" /> Supports Rewarded Ads</li>
                    <li><ui-checkbox id="supports-interstitial-ads" /> Supports Interstitial Ads</li>
                    <li><ui-checkbox id="supports-banner-ads" /> Supports Banner Ads</li>
                </ul>
            </ui-box-container>

            <ui-box-container style="margin: 5px;">
                <div class="layout vertical" id="ads-placements-container">
                    <div class="padded"><h3>Ads Placement Setup</h3></div>

                </div>
                <div class="padded"><ui-button style="width: 100%; margin-top: 10px;" id="btn-new-ad-placement">Add Placement</ui-button></div>
            </ui-box-container>

            <ui-box-container style="margin: 5px;">
                <div class="layout vertical" id="iaps-container">
                    <div class="padded layout horizontal center">
                        <div><h3>In App Purchases Setup</h3></div>
                        <div class="flex-1"></div>
                        <div class="end-justified"><ui-button id="btn-reset-iap">RESET IAPs</ui-button></div>
                    </div>

                </div>
                <div class="padded"><ui-button style="width: 100%; margin-top: 10px;" id="btn-new-iap">Add In App Purchase</ui-button></div>
            </ui-box-container>

            <ui-box-container style="margin: 5px;">
                <div class="layout vertical" id="leaderboards-container">
                    <div class="padded"><h3>Leaderboards Setup</h3></div>
                    
                </div>
                <div class="padded"><ui-button style="width: 100%; margin-top: 10px;" id="btn-new-leaderboard">Add Leaderboard</ui-button></div>
            </ui-box-container>

            <ui-box-container style="margin: 5px;">
                <div class="layout vertical" id="events-container">
                    <div class="padded"><h3>Events Setup</h3></div>
                    
                </div>
                <div class="padded"><ui-button style="width: 100%; margin-top: 10px;" id="btn-new-event">Add Event</ui-button></div>
            </ui-box-container>

            <div class="padded"><ui-button style="width: 100%; margin-top: 10px;" id="btn-save-settings">SAVE SETTINGS</ui-button></div>
        </div>
    `,

    $: {
        // Feature Support Checkboxes
        supportsIAPs: '#supports-iaps',
        supportsLeaderboards: '#supports-leaderboards',
        supportsRewardedAds: '#supports-rewarded-ads',
        supportsInterstitialAds: '#supports-interstitial-ads',
        supportsBannerAds: '#supports-banner-ads',

        // Containers
        adsPlacementsContainer: '#ads-placements-container',
        iapsContainer: '#iaps-container',
        leaderboardsContainer: '#leaderboards-container',
        eventsContainer: '#events-container',

        // Action Buttons
        newAdPlacementButton: '#btn-new-ad-placement',
        newIAPButton: '#btn-new-iap',
        resetIAPsButton: '#btn-reset-iap',
        newLeaderboardButton: '#btn-new-leaderboard',
        newEventButton: '#btn-new-event',
        saveSettingsButton: '#btn-save-settings',
    },

    ready() {
        // Feature Support Checkboxes
        this.$supportsIAPs.addEventListener('change', function () { featureSupport('supportsIAPs', this.checked); });
        this.$supportsLeaderboards.addEventListener('change', function () { featureSupport('supportsLeaderboards', this.checked); });
        this.$supportsRewardedAds.addEventListener('change', function () { featureSupport('supportsRewardedAds', this.checked); });
        this.$supportsInterstitialAds.addEventListener('change', function () { featureSupport('supportsInterstitialsAds', this.checked); });
        this.$supportsBannerAds.addEventListener('change', function () { featureSupport('supportsBannerAds', this.checked); });

        // Actions
        this.actions = {
            addAdPlacement: (html) => {
                if (!html) html = itemsHelper.newAdPlacement();
                    
                this.$adsPlacementsContainer.insertAdjacentHTML('beforeend', html);

                let newAdPlacementNode = this.$adsPlacementsContainer.lastElementChild;

                newAdPlacementNode.querySelector('#btn-delete-ad-placement').addEventListener('confirm', this.actions.deleteAdPlacement);
            },
            deleteAdPlacement: function () {
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
            },
            addIAP: (html) => {
                if (!html) html = itemsHelper.newIAP();
                
                this.$iapsContainer.insertAdjacentHTML('beforeend', html);

                let newIAPNode = this.$iapsContainer.lastElementChild;

                newIAPNode.querySelector('#btn-delete-iap').addEventListener('confirm', this.actions.deleteIAP);
            },
            deleteIAP: function () {
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
            },
            resetIAPs: function () {
                Editor.log("Resetting IAPs !");
            },
            addLeaderboard: (html) => {
                if (!html) html = itemsHelper.newLeaderboard();

                this.$leaderboardsContainer.insertAdjacentHTML('beforeend', html);

                let newLeaderboardNode = this.$leaderboardsContainer.lastElementChild;

                newLeaderboardNode.querySelector('#btn-delete-leaderboard').addEventListener('confirm', this.actions.deleteLeaderboard);
                newLeaderboardNode.querySelector('#btn-reset-leaderboard').addEventListener('confirm', this.actions.resetLeaderboard);
            },
            deleteLeaderboard: function () {
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
            },
            resetLeaderboard: function () {
                Editor.log("Resetting Leaderboard !");
            },
            addEvent: (html) => {
                if (!html) html = itemsHelper.newEvent();

                this.$eventsContainer.insertAdjacentHTML('beforeend', html);

                let newEventNode = this.$eventsContainer.lastElementChild;

                newEventNode.querySelector('#btn-delete-event').addEventListener('confirm', this.actions.deleteEvent);
            },
            deleteEvent: function () {
                this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
            },
            saveSettings: () => {
                this.actions.updateSettings();
                saveSettings();

                Editor.success("Settings Saved");
            },
            updateSettings: () => {
                let newSettings = {
                    supportsInterstitialsAds: kilnSettings.supportsInterstitialsAds || false,
                    supportsRewardedAds: kilnSettings.supportsRewardedAds || false,
                    supportsBannerAds: kilnSettings.supportsBannerAds || false,
                    supportsLeaderboards: kilnSettings.supportsLeaderboards || false,
                    supportsPlatformLeaderboardsUI: kilnSettings.supportsPlatformLeaderboardsUI || false,
                    supportsIAPs: kilnSettings.supportsIAPs || false,
                    interstitials: [],
                    banners: [],
                    rewarded: [],
                    events: [],
                    leaderboards: [],
                    iaps: []
                };

                // Ads
                this.$adsPlacementsContainer.querySelectorAll("#ad-placement").forEach((adNode) => {
                    const adId = adNode.querySelector("#ad-placement-id").value;

                    if (adId == "") {
                        Editor.warn("Ad Placement with empty ID. Ignoring.");
                        return;
                    }

                    const adType = adNode.querySelector("#ad-type").value;

                    switch (adType) {
                        case "REWARDED_VIDEO":
                            newSettings.rewarded.push(adId);
                            break;
                        case "INTERSTITIAL":
                            newSettings.interstitials.push(adId);
                            break;
                        case "BANNER":
                            newSettings.banners.push(adId);
                            break;
                    
                        default:
                            Editor.error(`Incorrect Ad Type: ${adType}`)
                            break;
                    }
                });

                // IAPs
                this.$iapsContainer.querySelectorAll("#iap").forEach((iapNode) => {
                    const iapId = iapNode.querySelector("#iap-id").value;

                    if (iapId == "") {
                        Editor.warn("IAP with empty ID. Ignoring.");
                        return;
                    }

                    const iapPrice = iapNode.querySelector("#iap-price").value;

                    if (iapPrice == "") {
                        Editor.warn("IAP with empty Price. Ignoring.");
                        return;
                    }

                    const iapDescription = iapNode.querySelector("#iap-description").value;
                    const iapType = iapNode.querySelector("#iap-type").value;
                    const iapImageURI = iapNode.querySelector("#iap-icon-uri").value;
                    const iapCurrencyCode = iapNode.querySelector("#iap-currency-code").value;

                    newSettings.iaps.push({
                        id: iapId,
                        consumable: iapType == "CONSUMABLE",
                        price: iapPrice,
                        description: iapDescription,
                        imageURI: iapImageURI,
                        currencyCode: iapCurrencyCode
                    });
                
                });

                // Leaderboards
                this.$leaderboardsContainer.querySelectorAll("#leaderboard").forEach((leaderboardNode) => {
                    const leaderboardId = leaderboardNode.querySelector("#leaderboard-id").value;

                    if (leaderboardId == "") {
                        Editor.warn("Leaderboard with empty ID. Ignoring.");
                        return;
                    }

                    const leaderboardType = leaderboardNode.querySelector("#leaderboard-type").value;

                    newSettings.leaderboards.push({
                        id: leaderboardId,
                        ascending: leaderboardType == "LOW_TO_HIGH"
                    });
                });

                // Events
                this.$eventsContainer.querySelectorAll("#event").forEach((eventNode) => {
                    const eventId = eventNode.querySelector("#event-id").value;

                    if (eventId == "") {
                        Editor.warn("Event with empty ID. Ignoring.");
                        return;
                    }

                    newSettings.events.push(eventId);
                });

                kilnSettings = newSettings;
            }
        }

        this.$newAdPlacementButton.addEventListener('confirm', () => { this.actions.addAdPlacement(); });
        this.$newIAPButton.addEventListener('confirm', () => { this.actions.addIAP(); });
        this.$resetIAPsButton.addEventListener('confirm', () => { this.actions.resetIAPs(); });
        this.$newLeaderboardButton.addEventListener('confirm', () => { this.actions.addLeaderboard(); });
        this.$newEventButton.addEventListener('confirm', () => { this.actions.newEvent(); });
        this.$saveSettingsButton.addEventListener('confirm', () => { this.actions.saveSettings(); });
    },

    run(settings) {
        kilnSettings = settings;

        // Apply Kiln configuration
        this.$supportsIAPs.checked = kilnSettings.supportsIAPs;
        this.$supportsLeaderboards.checked = kilnSettings.supportsLeaderboards;
        this.$supportsRewardedAds.checked = kilnSettings.supportsRewardedAds;
        this.$supportsInterstitialAds.checked = kilnSettings.supportsInterstitialsAds;
        this.$supportsBannerAds.checked = kilnSettings.supportsBannerAds;

        kilnSettings.rewarded.forEach((ad) => {
            const item = itemsHelper.newAdPlacement({ id: ad, type: "REWARDED_VIDEO" })
            this.actions.addAdPlacement(item);
        });
        kilnSettings.interstitials.forEach((ad) => {
            const item = itemsHelper.newAdPlacement({ id: ad, type: "INTERSTITIAL" })
            this.actions.addAdPlacement(item);
        });
        kilnSettings.banners.forEach((ad) => {
            const item = itemsHelper.newAdPlacement({ id: ad, type: "BANNER" })
            this.actions.addAdPlacement(item);
        });

        kilnSettings.iaps.forEach((iap) => this.actions.addIAP(itemsHelper.newIAP(iap)));
        kilnSettings.leaderboards.forEach((leaderboard) => this.actions.addLeaderboard(itemsHelper.newLeaderboard(leaderboard)));
        kilnSettings.events.forEach((event) => this.actions.addEvent(itemsHelper.newEvent({ id: event })));
    },
};

/**
 * 
 * @param {*} featureName 
 */
function featureSupport(featureName, enabled) {
    kilnSettings[featureName] = enabled;
}

/**
 * 
 */
function saveSettings() {
    Editor.assetdb.saveExists('db://assets/resources/kiln/kilnSettings.json', JSON.stringify(kilnSettings), function (err, meta) {
        if(err) {
            Editor.error("Failed to update Kiln Settings asset");
            Editor.error(err);
        }
    });
}

Editor.Panel.extend(editorPanel);