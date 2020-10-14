'use strict';

const path = require('path');
const util = require('util');
const fs = require('fs');
const appDir = path.dirname(require.main.filename);
const moment = require('moment');
const c = require("./color");

const levels = {
  trace:  {level: 5, color: "120"},
  debug:  {level: 4, color: "207"},
  log:    {level: 3, color: "255"},
  info:   {level: 2, color: "45"},
  warn:   {level: 1, color: "220"},
  error:  {level: 0, color: "204"}
};

const defaultOptions = {
  colors: true,
  timestamp: true,
  level: 5,
  inspectDepth: 5,
  enable_file: !process.env.LOG_OFF,
  filename: appDir+"/logs/output.log"
};

util.inspect.defaultOptions.depth = -1;

let lastMessageTime = null;

class Logger {
  constructor(category, options) {
    this.category = category;
    let opts = {};
    Object.assign(opts, defaultOptions);
    Object.assign(opts, options);
    this.options = opts;

    if(!this.options.colors) {
      c.enable(false);
    }

    if(this.options.enable_file) {
      const logDir = path.dirname(this.options.filename);
      if (!fs.existsSync(logDir)){
        fs.mkdirSync(logDir);
      }
      this.fileStream = fs.createWriteStream(this.options.filename, {flags:"a"});
    }


    let what = this;
    Object.keys(levels).forEach(lvl => {
      what[lvl] = function() {
        if(this.options.level >= levels[lvl].level) {
          const args = Array.prototype.slice.call(arguments);
          what._log(lvl, args);
        }
      };
      //this._log(lvl, [lvl]);
    });
  }

  _log(level, args) {
    let color = levels[level].color;
    let parts = [];
    let message = util.format.apply(null, args);


    let timestamp = (this.options.timestamp ? moment().format("YYYY-MM-DD HH:mm:ss.SSS") : "");


    parts.push("["+level+"]");
    parts.push(this.category);


    let prefix = parts.join(" ");
    let suffix = Logger._executionTime();

    if(this.options.enable_file) {
      this.fileStream.write(timestamp + " " + prefix + " " + message + " " + suffix + "\n");
    }

    if(this.options.colors) {
      prefix = c(prefix).color(color);
      suffix = c(suffix).color(color);
    }

    let msg = timestamp + " " + prefix + " " + message + " " + suffix + "\n";
    if (level === "error") {
      process.stderr.write(msg);
    } else {
      process.stdout.write(msg);
    }

    args.forEach(obj => {
      if(obj instanceof Object) {
        this._inspect(level, obj);
      }
    });
  }

  _inspect(level, obj) {
    let message = c("    Object Inspection    ").underline().bold().toString();

    this._log(level, [message]);
    util
      .inspect(obj,{
        showHidden: false,
        depth: this.options.inspectDepth,
        colors: this.options.colors
      })
      .split("\n")
      .forEach(line => this._log(level, [line]));
  }

  static _executionTime() {
    let currentTime = moment();
    let ret = "";

    if (lastMessageTime !== null) {
      let diff = currentTime.diff(lastMessageTime, "ms");
      ret = "+"+(diff < 1000 ? diff+"ms" : Math.round(diff/100)/10+"s");
    }

    lastMessageTime = currentTime;
    return ret;
  }
}

module.exports = (category, options) => new Logger(category, options);