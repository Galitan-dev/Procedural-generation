const EMPTY = 'empty';

/**
 * @param {(x: number, y: number, prev: * | 'empty') => *} cb 
 */
const createArray2D = function (c, r, fillCb = () => EMPTY) {
    return new Array2D(C, R).fill(fillCb);
}

const Array2D = class {

    constructor(c, r) {
        this.C = c;
        this.R = r;

        /** @type {{ x: number, y: number, object: * }[]} */
        this.items = [];
    }

    /**
     * @param {(x: number, y: number, prev: * | 'empty') => *} cb 
     */
    fill(cb = () => EMPTY) {
        let prev = EMPTY;
        for (let x = 0; x < this.C; x++) {
            for (let y = 0; y < this.R; y++) {
                const actual = cb(x, y, prev);
                this.set(x, y, actual)
                prev = actual;
            }
        }
        return this;
    }

    get(x, y) {
        return this.items.find(el => el.x == x && el.y == y).object || EMPTY;
    }

    get array() {
        return this.items.map(el => el.object);
    }

    get length() {
        return this.items.filter(el => !!el && !isEmpty(el.object));
    }

    get rows() { // return *[y][x]
        const rows = [];

        for (let y = 0; y < this.R; y++) {
            rows[y] = this.row(y);
        }

        return rows;
    }

    get columns() { // return *[x][y]
        const columns = [];

        for (let x = 0; x < this.C; x++) {
            columns[x] = this.column(x);
        }

        return columns;
    }

    row(y) { //return *[x]
        const row = [];

        for (let x = 0; x < this.C; x++) {
            row[x] = this.get(x, y);
        }

        return row;
    }

    column(x) { //return *[y]
        const column = [];

        for (let y = 0; y < this.R; y++) {
            column[y] = this.get(x, y);
        }

        return column;
    }

    set(x, y, object) {
        if (x >= this.C || this.x < 0 || this.y >= this.R || y < 0)
            throw new Error("Invalid Position");

        this.del(x, y);
        this.items.push({
            x,
            y,
            object
        });
    }

    del(x, y) {
        const deleted = this.items.find(el => el.x == x && el.y == y) || {
            object: EMPTY
        };
        this.items = this.items.filter(el => !(el.x == x && el.y == y));
        return deleted.object || EMPTY;
    }

}