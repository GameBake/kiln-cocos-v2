package io.gamebake.kilnCocos;

import android.telecom.Call;
import android.util.DisplayMetrics;
import android.util.Log;

import androidx.annotation.Nullable;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import io.gamebake.kiln.Callback;
import io.gamebake.kiln.Kiln;
import io.gamebake.kiln.types.Product;
import io.gamebake.kiln.types.Purchase;
import io.gamebake.kiln.types.PurchaseSettings;
import io.gamebake.kiln.types.RewardedAdResponse;
import io.gamebake.kiln.types.Score;

public class Bridge {
    private static Cocos2dxActivity app = null;
    private static Bridge mInstance = null;
    private static Kiln kiln;

    enum KilnBannerSize {
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
        ScreenWidthHeight280;

        public Float Width() {
            switch (this) {
                case Width300Height50:
                case Width300Height250:
                    return 300f;
                case Width320Height50:
                    return 320f;
                case Width336Height280:
                    return 336f;
                case Width468Height60:
                    return 468f;
                case Width728Height90:
                    return 728f;
                case Width970Height90:
                case Width970Height250:
                    return 970f;
                case ScreenWidthHeight50:
                case ScreenWidthHeight90:
                case ScreenWidthHeight250:
                case ScreenWidthHeight280:
                    DisplayMetrics metrics = app.getResources().getDisplayMetrics();

                    int pixels = metrics.widthPixels;
                    int dpi = metrics.densityDpi;
                    Float dips = pixels / (dpi / 160.0f);
                    return dips;
                default:
                    // fallback to default size: Width320Height50
                    return 300f;
            }
        }

        public Float Height() {
            switch (this) {
                case Width300Height50:
                case Width320Height50:
                case ScreenWidthHeight50:
                    return 50f;
                case Width468Height60:
                    return 60f;
                case Width728Height90:
                case Width970Height90:
                case ScreenWidthHeight90:
                    return 90f;
                case Width300Height250:
                case Width970Height250:
                case ScreenWidthHeight250:
                    return 250f;
                case Width336Height280:
                case ScreenWidthHeight280:
                    return 280f;
                default:
                    // fallback to default size: Width320Height50
                    return 50f;
            }
        }
    }

    public static Bridge getInstance() {
        if (null == mInstance) {
            mInstance = new Bridge();
        }
        return mInstance;
    }

    public void init(Cocos2dxActivity context) {
        this.app = context;
        this.kiln = new Kiln(app);
    }


    /**
     *
     */
    public static void init() {
        kiln.init(new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onInitSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onInitFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     */
    public static void loadInterstitialAd(String placementId) {
        kiln.loadInterstitialAd(placementId, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onLoadInterstitialAdSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onLoadInterstitialAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     */
    public static void showInterstitialAd(String placementId) {
        kiln.showInterstitialAd(placementId, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowInterstitialAdSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowInterstitialAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     */
    public static void loadRewardedAd(String placementId) {
        kiln.loadRewardedAd(placementId, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onLoadRewardedAdSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onLoadRewardedAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     */
    public static void showRewardedAd(final String placementId) {
        kiln.showRewardedAd(placementId, new Callback<RewardedAdResponse>() {
            @Override
            public void onSuccess(final RewardedAdResponse response) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        String boolValue = (response.getWithReward()) ? "true" : "false";

                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowRewardedAdSuccess({placementId: \"" + placementId + "\", withReward: " + boolValue + "});");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowRewardedAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     * @param alignment
     * @param maxSize
     */
    public static void loadBannerAd(final String placementId, int alignment, int maxSize) {
        Float width = KilnBannerSize.values()[maxSize].Width();
        Float height = KilnBannerSize.values()[maxSize].Height();

        kiln.loadBannerAd(placementId, width, height, alignment, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onLoadBannerAdSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onLoadBannerAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     */
    public static void showBannerAd(final String placementId) {
        kiln.showBannerAd(placementId, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowBannerAdSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowBannerAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     */
    public static void hideBannerAd(final String placementId) {
        kiln.hideBannerAd(placementId, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onHideBannerAdSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onHideBannerAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param placementId
     */
    public static void destroyBannerAd(final String placementId) {
        kiln.destroyBannerAd(placementId, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onDestroyBannerAdSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onDestroyBannerAdFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    private static Callback<List<Product>> getAvailableProductsCallback() {
        return new Callback<List<Product>>() {
            @Override
            public void onSuccess(List<Product> products) {
                String jsResponse = "[";

                for (Product p: products) {
                    jsResponse += Helper.productToJSObject(p) + ",";
                }

                jsResponse += "]";
                final String response = jsResponse;

                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetAvailableProductsSuccess(" + response +");");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetAvailableProductsFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        };
    }

    /**
     *
     */
    public static void getAvailableProducts() {
        kiln.getAvailableProducts(getAvailableProductsCallback());
    }

    /**
     *
     * @param json
     */
    public static void getAvailableProducts(String json) {
        try {
            JSONObject root = new JSONObject(json);

            JSONArray idList = root.getJSONArray("ids");

            List<String> ids = new ArrayList<>();

            for (int i = 0; i < idList.length(); i++) {
                ids.add(idList.getString(i));
            }

            kiln.getAvailableProducts(ids, getAvailableProductsCallback());

        }
        catch (JSONException e) {
            Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetAvailableProductsFailure(new Error(\"" + e.getMessage() + "\"));");
        }
    }

    /**
     *
     */
    public static void getPurchases() {
        kiln.getPurchasedProducts(new Callback<List<Purchase>>() {
            @Override
            public void onSuccess(List<Purchase> purchases) {
                String jsResponse = "[";

                for (Purchase p: purchases) {
                    jsResponse += Helper.purchaseToJSObject(p) + ",";
                }

                jsResponse += "]";
                final String response = jsResponse;

                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetPurchasesSuccess(" + response +");");
                    }
                });

            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetPurchasesFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param productID
     * @param developerPayload
     */
    public static void purchaseProduct(String productID, String developerPayload) {
        final String id = productID;
        final String payload = developerPayload;

        Bridge.kiln.purchaseProduct(new PurchaseSettings() {
            @Override
            public String getProductID() { return id; }

            @Override
            public String getDeveloperPayload() { return null; }
        }, new Callback<Purchase>() {
            @Override
            public void onSuccess(final Purchase purchase) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onPurchaseProductSuccess(" + Helper.purchaseToJSObject(purchase) +");");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onPurchaseProductFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param purchaseToken
     */
    public static void consumePurchasedProduct(String purchaseToken) {
        Bridge.kiln.consumePurchasedProduct(purchaseToken, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onConsumePurchasedProductSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onConsumePurchasedProductFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param leaderboardID
     */
    public static void getUserScore(String leaderboardID) {
        Bridge.kiln.getUserScore(leaderboardID, new Callback<Score>() {
            @Override
            public void onSuccess(final Score score) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetUserScoreSuccess(" + Helper.scoreToJSObject(score) + ");");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetUserScoreFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param leaderboardID
     * @param score
     * @param data
     */
    public static void setUserScore(String leaderboardID, float score, @Nullable String data) {
        Bridge.kiln.setUserScore(leaderboardID, score, data, new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onSetUserScoreSuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onSetUserScoreFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param amount
     * @param offset
     * @param leaderboardID
     */
    public static void getScores(String leaderboardID, int amount, int offset) {
        Bridge.kiln.getScores(amount, offset, leaderboardID, new Callback<List<Score>>() {
            @Override
            public void onSuccess(List<Score> scores) {
                String jsResponse = "[";

                for (Score s: scores) {
                    jsResponse += Helper.scoreToJSObject(s) + ",";
                }

                jsResponse += "]";
                final String response = jsResponse;

                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetScoresSuccess(" + response +");");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onGetScoresFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     */
    public static void showPlatformLeaderboardUI() {
        Bridge.kiln.showLeaderboardUI(new Callback<Void>() {
            @Override
            public void onSuccess(Void aVoid) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowPlatformLeaderboardUISuccess();");
                    }
                });
            }

            @Override
            public void onFailure(final Exception e) {
                app.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onShowPlatformLeaderboardUIFailure(new Error(\"" + e.getMessage() + "\"));");
                    }
                });
            }
        });
    }

    /**
     *
     * @param eventID
     */
    public static void submitAnalyticsEvent(String eventID) {
        try {
            Bridge.kiln.submitAnalyticsEvent(eventID);

            app.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onSubmitAnalyticsEventSuccess();");
                }
            });
        }
        catch (final Exception e) {
            app.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString("Kiln.Callbacks.onSubmitAnalyticsEventFailure(new Error(\"" + e.getMessage() + "\"));");
                }
            });
        }
    }


}
