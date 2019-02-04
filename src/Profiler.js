module.exports = class Profiler {
  constructor() {
    this.init();
  }

  init() {
    this.sep = '+---------------+';
    this.unit = 'μs';
    this.stack = [];
    this.add('init');
    return this;
  }

  add(event) {
    const hrTime = process.hrtime();
    this.stack.push({ event, ts: (hrTime[0] * 1000000) + (hrTime[1] / 1000) });
  }

  sort() {
    this.stack.sort((a, b) => {
      if (a.ts < b.ts) return -1;
      if (a.ts > b.ts) return 1;
      return 0;
    });
  }

  show(cb) {
    this.sort();
    cb(this.sep);
    cb('+ Profile items +');
    cb(this.sep);
    this.stack.forEach((t, i) => {
      if (i > 0) cb(`${t.event} ${t.ts - this.stack[i - 1].ts} ${this.unit}`);
    });
  }

  total(cb) {
    cb(this.sep);
    cb('+ Profile total +');
    cb(this.sep);
    cb(`Δtotal ${this.stack[this.stack.length - 1].ts - this.stack[0].ts} ${this.unit}`);
  }
};
