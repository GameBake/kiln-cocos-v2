module.exports = {
    'reset-iaps': function (event) {
        // var inAppPurchases = cc.require ('inAppPurchases');
        // inAppPurchases.reset();

        if (event.reply) {
            event.reply("Can't modify browser's localStorage from here. You'll have to manually run KilnInAppPurchases.reset();");
        }
    },
    'reset-leaderboard': function (event, id) {
        if (event.reply) {
            event.reply("Can't modify browser's localStorage from here. You'll have to manually run KilnLeaderboard.reset(id);");
        }
    },
};