import { KilnBannerPosition, KilnBannerSize } from "../../api";

const {ccclass, property} = cc._decorator;

@ccclass
export default class KilnBannerAdController extends cc.Component {

    @property(cc.Node)
    bannerImage: cc.Node = null;

    @property(cc.Label)
    label: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.hideBanner();

        // Only works for root node level
        // TODO: We'll need to sort this out somehow to persist the banner
        // across different scenes
        // cc.game.addPersistRootNode(this.node);
    }

    // start () {}

    /**
     * 
     * @param placementId 
     * @param position 
     * @param maxSize 
     */
    public configure(placementId: string, position: KilnBannerPosition, maxSize: KilnBannerSize) {
        // Get DP (Density Independent) Sizes converted to current screen dpi
        var width = this.width(maxSize) / cc.view.getDevicePixelRatio();
        var height = this.height(maxSize) / cc.view.getDevicePixelRatio();

        let widget = this.bannerImage.getComponent(cc.Widget);
        let anchor: cc.Vec2;

        switch (position) {
            case KilnBannerPosition.TopLeft:
                anchor = new cc.Vec2(0, 1);
                break;

            case KilnBannerPosition.TopCenter:
                anchor = new cc.Vec2(0.5, 1);
                break;

            case KilnBannerPosition.TopRight:
                anchor = new cc.Vec2(1, 1);
                break;

            case KilnBannerPosition.Centered:
                anchor = new cc.Vec2(0.5, 0.5);
                break;

            case KilnBannerPosition.BottomLeft:
                anchor = new cc.Vec2(0, 0);
                break;
                
            case KilnBannerPosition.BottomCenter:
                anchor = new cc.Vec2(0.5, 0);
                break;

            case KilnBannerPosition.BottomRight:
                anchor = new cc.Vec2(1, 0);
                break;
        }

        // Set the size
        this.bannerImage.width = width;
        this.bannerImage.height = height;
        
        // Position Banner
        this.bannerImage.setAnchorPoint(anchor)

        if (anchor.x == 0) {
            widget.isAlignLeft = true;
            widget.left = 0;
        }
        else if (anchor.x == 1) {
            widget.isAlignRight = true;
            widget.right = 0;
        }
        
        if (anchor.y == 0) {
            widget.isAlignBottom = true;
            widget.bottom = 0;
        }
        else if (anchor.y == 1) {
            widget.isAlignTop = true;
            widget.top = 0;
        }

        this.label.string = placementId;
    }

    /**
     * 
     */
    public showBanner() {
        if (this.node.parent == null) cc.Canvas.instance.node.addChild(this.node);
            
        this.bannerImage.active = true;
    }

    /**
     * 
     */
    public hideBanner() {
        this.bannerImage.active = false;
    }

    /**
     * 
     */
    public destroyBanner() {
        this.node.destroy();
    }

    private width(adSize: KilnBannerSize): number {
        switch (adSize) {
            case KilnBannerSize.Width300Height50:
            case KilnBannerSize.Width300Height250:
                return 300;
            case KilnBannerSize.Width320Height50:
                return 320;
            case KilnBannerSize.Width336Height280:
                return 336;
            case KilnBannerSize.Width468Height60:
                return 468;
            case KilnBannerSize.Width728Height90:
                return 728;
            case KilnBannerSize.Width970Height90:
            case KilnBannerSize.Width970Height250:
                return 970;
            case KilnBannerSize.ScreenWidthHeight50:
            case KilnBannerSize.ScreenWidthHeight90:
            case KilnBannerSize.ScreenWidthHeight250:
            case KilnBannerSize.ScreenWidthHeight280:
                var pixels = cc.winSize.width;
                var dips = pixels / cc.view.getDevicePixelRatio();
                return dips;
            default:
                // fallback to default size: Width320Height50
                return 300;
        }
    }


    public height(adSize: KilnBannerSize): number {
        switch (adSize) {
            case KilnBannerSize.Width300Height50:
            case KilnBannerSize.Width320Height50:
            case KilnBannerSize.ScreenWidthHeight50:
                return 50;
            case KilnBannerSize.Width468Height60:
                return 60;
            case KilnBannerSize.Width728Height90:
            case KilnBannerSize.Width970Height90:
            case KilnBannerSize.ScreenWidthHeight90:
                return 90;
            case KilnBannerSize.Width300Height250:
            case KilnBannerSize.Width970Height250:
            case KilnBannerSize.ScreenWidthHeight250:
                return 250;
            case KilnBannerSize.Width336Height280:
            case KilnBannerSize.ScreenWidthHeight280:
                return 280;
            default:
                // fallback to default size: Width320Height50
                return 50;
        }
    }
}
