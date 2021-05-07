package io.gamebake.kilnCocos;

import io.gamebake.kiln.types.Player;
import io.gamebake.kiln.types.Product;
import io.gamebake.kiln.types.Purchase;
import io.gamebake.kiln.types.Score;

public class Helper {

    /**
     *
     * @param string
     * @return
     */
    private static String stringValueOrNull(String string) {
        if(string == null) return "null";

        return "\"" + string + "\"";
    }

    /**
     *
     * @param p
     * @return
     */
    public static String productToJSObject(Product p) {
        String jsProduct = "{";

        // getProductID: () => string,
        jsProduct += "getProductId: () => " + stringValueOrNull(p.getProductID()) + ",";
        // getPrice: () => string,
        jsProduct += "getPrice: () => " + stringValueOrNull(p.getPrice()) + ",";
        // getProductType: () => ProductType,
        String productType = "ProductType.";
        productType += (p.getType() == Product.Type.CONSUMABLE) ? "Consumable" : "NonConsumable";
        jsProduct += "getProductType: () => " + productType + ",";
        // getDescription: () => string,
        jsProduct += "getDescription: () => " + stringValueOrNull(p.getDescription()) + ",";
        // getImageURI: () => string,
        jsProduct += "getImageURI: () => " + stringValueOrNull(p.getImageURI()) + ",";
        // getPriceCurrencyCode: () => string,
        jsProduct += "getPriceCurrencyCode: () => " + stringValueOrNull(p.getPriceCurrencyCode()) + ",";
        // toString: () => string
        jsProduct += "toString: () => " + stringValueOrNull(p.toString());

        jsProduct += "}";

        return jsProduct;
    }

    /**
     *
     * @param p
     * @return
     */
    public static String purchaseToJSObject(Purchase p) {
        String jsPurchase = "{";

        // getDeveloperPayload: () => string,
        jsPurchase += "getDeveloperPayload: () => " + stringValueOrNull(p.getDeveloperPayload()) + ",";
        // getProductID: () => string,
        jsPurchase += "getProductId: () => " + stringValueOrNull(p.getProductID()) + ",";
        // getPurchaseToken: () => string,
        jsPurchase += "getPurchaseToken: () => " + stringValueOrNull(p.getPurchaseToken()) + ",";
        // getPurchaseTime: () => string,
        jsPurchase += "getPurchaseTime: () => " + stringValueOrNull(p.getPurchaseTime()) + ",";
        // getSignedRequest: () => string,
        jsPurchase += "getSignedRequest: () => " + stringValueOrNull(p.getSignedRequest()) + ",";
        // toString: () => string
        jsPurchase += "toString: () => " + stringValueOrNull(p.toString());

        jsPurchase += "}";

        return jsPurchase;
    }

    /**
     *
     * @param s
     * @return
     */
    public static String scoreToJSObject(Score s) {
        String jsScore = "{";

        // getScore: () => number,
        jsScore += "getScore: () => " + s.getScore() + ",";
        // getRank: () => number,
        jsScore += "getRank: () => " + s.getRank() + ",";
        // getPlayer: () => IPlayer,
        jsScore += "getPlayer: () => { return " + playerToJSObject(s.getPlayer()) + " },";
        // toString: () => string,
        jsScore += "toString: () => " + stringValueOrNull(s.toString());

        jsScore += "}";

        return jsScore;
    }

    /**
     *
     * @param p
     * @return
     */
    public static String playerToJSObject(Player p) {
        String jsPlayer = "{";

        // getId: () => string,
        jsPlayer += "getId: () => " + stringValueOrNull(p.getId()) + ",";
        // getName: () => string,
        jsPlayer += "getName: () => " + stringValueOrNull(p.getName()) + ",";
        // getPhotoURL: () => string,
        jsPlayer += "getPhotoURL: () => " + stringValueOrNull(p.getPhotoURL());

        jsPlayer += "}";

        return jsPlayer;
    }
}
