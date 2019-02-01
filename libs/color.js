'use strict';

let _enable = true;

class Color {
    constructor(string) {
        this._string = string;
    }

    static enable(enable) {
        _enable = enable;
    }

    toString() {
        return this._string;
    }

    color(color) {
        if(_enable) {
            this._string = "\x1B[38;5;"+color+"m"+this._string+"\x1B[0m";
        }
        return this;
    }

    bold() {
        if(_enable) {
            this._string = "\x1B[1m"+this._string+"\x1B[21m";
        }
        return this;
    }

    underline() {
        if(_enable) {
            this._string = "\x1B[4m"+this._string+"\x1B[24m";
        }
        return this;
    }
}

module.exports = string => new Color(string);
