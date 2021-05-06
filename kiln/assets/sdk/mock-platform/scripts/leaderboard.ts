import { ILeaderboardEntry, IPlayer } from "../../bridge";
import KilnHelper from "./helper";

/**
 * Incredibly inefficient implementation of a Leaderboard system for in editor development mocking purposes
 */
export default class KilnLeaderboard {
    private _id: string;
    private _data: Map<string, number> = new Map<string, number>();
    private _ascending: boolean;

    private PLAYER_KEY = "PLAYER";

    constructor(id: string = "leaderboard", amount: number = 100, ascending: boolean = false, persistOnInstantiate: boolean = true) {
        this._id = id;
        this._ascending = ascending;
        this.initialize(amount);
        
        if(persistOnInstantiate) this.save();
    }

    /**
     * Erases the storage datafile for a leaderboard
     * @param id Leaderboard id
     */
    public static reset(id: string) {
        cc.sys.localStorage.removeItem(KilnLeaderboard.getStorageKey(id));
    }

    /**
     * Returns the key that'll hold the data for a leaderboard
     * @param id 
     * @returns 
     */
    public static getStorageKey(id: string): string
    {
        return `Kiln:Leaderboards:${id}`;
    }

    /// <summary>
    /// Creates an instance of a Leaderboard from a persisted json file
    /// </summary>
    /// <param name="json"></param>
    /// <returns></returns>
    public static load(id: string): KilnLeaderboard {
        if (!this.isSaved(id)) {
            throw new Error(`Leaderboard ${id} not persisted`);
        }

        const data: KilnLeaderboardData = JSON.parse(cc.sys.localStorage.getItem(KilnLeaderboard.getStorageKey(id)));

        const leaderboard = new KilnLeaderboard(data.id, data.data.length, data.ascending, false);

        leaderboard._data.clear();
        
        data.data.forEach((entry) => {
            leaderboard._data.set(entry.name, entry.score);
        });

        return leaderboard;
    }

    /// <summary>
    /// Returns whether a saved file for a given Leaderboard id is present or not
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public static isSaved(id: string): boolean {
        return cc.sys.localStorage.getItem(KilnLeaderboard.getStorageKey(id)) ? true : false;
    }

    /**
     * 
     * @param amount 
     */
    private initialize(amount: number) {
        if (amount > 100) {
            amount = 100;
            cc.warn("Dummy leaderboard capped at 100 entries. No reason to use more for development.");
        }

        const namesAmount: number = KilnHelper.Names.length;
        let score = this._ascending ? 10 : 10000;

        for (let i = 0; i < amount; i++) {
            let done = false;
            while (!done) {
                try {
                    const randomIndex = Math.floor(Math.random() * namesAmount);
                    this._data.set(KilnHelper.Names[randomIndex], score);
                    score += (this._ascending ? 1 : -1) * 10;

                    done = true;
                }
                catch (err) { }
            }
        }
    }

    /**
     * 
     */
    private save() {
        cc.sys.localStorage.setItem(KilnLeaderboard.getStorageKey(this._id), this.getSaveData())
    }

    /**
     * Returns a JSON representation of the leaderboard
     * @returns 
     */
    public getSaveData(): string
    {
        const result: KilnLeaderboardData = {
            id: this._id,
            ascending: this._ascending,
            data: new Array<KilnLeaderboardEntry>(),
        };
        
        this._data.forEach((score, name) => {
            result.data.push({ score: score, name: name });
        });

        return JSON.stringify(result);
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    private getRank(id: string): number {
        let dataList = new Array<KilnLeaderboardEntry>();
        this._data.forEach((value: number, key: string) => {
            dataList.push({ name: key, score: value });
        });

        dataList.sort((x: KilnLeaderboardEntry, y: KilnLeaderboardEntry) => {
            if (!this._ascending) {
                if (x.score < y.score) return 1;
                else if (x.score > y.score) return -1;
            }
            else {
                if (x.score < y.score) return -1;
                else if (x.score > y.score) return 1;
            }
            
            return 0;
        })

        for (let i = 0; i < dataList.length; i++) {
            if(dataList[i].name == id) return i + 1;
        }

        throw new Error(`User ${id} doesn't have a rank in leaderboard id: ${this._id}`);
    }

    /**
     * Outputs Leaderboard to console
     */
    public debug() {
        this._data.forEach((score, name) => {
            cc.log(`${name} -- ${score}`)
        });
    }

    /**
     * 
     * @param score 
     * @param data 
     */
    public setUserScore(score: number, data: object) {
        if (this._data.has(this.PLAYER_KEY)) {
            if ((!this._ascending && score > this._data.get(this.PLAYER_KEY)) ||
                (this._ascending && score < this._data.get(this.PLAYER_KEY))) {
                this._data.set(this.PLAYER_KEY, score);
                
                this.save();
            }
        }
        else {
            this._data.set(this.PLAYER_KEY, score);
            this.save();
        }
    }

    /**
     * 
     * @returns 
     */
    public getUserScore(): ILeaderboardEntry {
        if (!this._data.has(this.PLAYER_KEY)) {
            throw new Error(`User ${this.PLAYER_KEY} not present in leaderboard.`);
        }

        let player: IPlayer = {
            getId: () => "",
            getName: () => this.PLAYER_KEY,
            getPhotoURL: () => "",
        }

        const score = this._data.get(this.PLAYER_KEY);
        const rank = this.getRank(this.PLAYER_KEY);
        return {
            getScore: () => score,
            getRank: () => rank,
            getPlayer: () => player,
            toString: () => `Player ${player.getName()} - score: ${score}, rank: ${rank}`
        };
    }

    /**
     * 
     * @param count 
     * @param offset 
     * @returns 
     */
    public getScores(count: number, offset: number): Array<ILeaderboardEntry> {
        const scores = new Array<ILeaderboardEntry>();

        if (this._data.size > offset) {
            let dataList = new Array<KilnLeaderboardEntry>();
            this._data.forEach((value: number, key: string) => {
                dataList.push({ name: key, score: value });
            });

            dataList.sort((x: KilnLeaderboardEntry, y: KilnLeaderboardEntry) => {
                if (!this._ascending) {
                    if (x.score < y.score) return 1;
                    else if (x.score > y.score) return -1;
                }
                else {
                    if (x.score < y.score) return -1;
                    else if (x.score > y.score) return 1;
                }
                
                return 0;
            })
            
            for (let i = offset; i < count + offset; i++) {
                if (i >= this._data.size) break;
                
                const player: IPlayer = {
                    getId: () => "",
                    getName: () => dataList[i].name,
                    getPhotoURL: () => "",
                }

                const rank = offset + i + 1
                const entry: ILeaderboardEntry = {
                    getScore: () => dataList[i].score,
                    getRank: () => rank,
                    getPlayer: () => player,
                    toString: () => `Player ${player.getName()} - score: ${dataList[i].score}, rank: ${rank}`
                }

                scores.push(entry);
            }
        }

        return scores;
    }


}

interface KilnLeaderboardData {
    id: string;
    data: Array<KilnLeaderboardEntry>;
    ascending: boolean;
}

interface KilnLeaderboardEntry {
    name: string,
    score: number
}
