const {ccclass, property} = cc._decorator;

@ccclass
export default class Logger extends cc.Component {

    @property(cc.RichText)
    console: cc.RichText = null;

    @property(cc.Color)
    warnColor: cc.Color = new cc.Color(255, 255, 0, 255);

    @property(cc.Color)
    errorColor: cc.Color = new cc.Color(255, 0, 0, 255);

    /**
     * 
     * @param msg 
     */
    public log(msg: string) {
        this.console.string += `${msg}\n`;
        cc.log(msg);
    }

    /**
     * 
     * @param msg 
     */
    public warn(msg: string) {
        this.console.string += `<color=${this.warnColor.toCSS("#rrggbb")}>${msg}</color>\n`;
        cc.warn(msg);
    }

    /**
     * 
     * @param msg 
     */
    public error(msg: string) {
        this.console.string += `<color=${this.errorColor.toCSS("#rrggbb")}>${msg}</color>\n`;
        cc.error(msg);
    }

    /**
     * 
     */
    public clearConsole() {
        this.console.string = "";
    }
}
