// Polyfill for Array.prototype.at() and String.prototype.at()
// Required for Safari < 15.4 / iOS < 15.4
// @supabase/ssr uses .at() internally
(function() {
  if (!Array.prototype.at) {
    Object.defineProperty(Array.prototype, 'at', {
      value: function(n) {
        n = Math.trunc(n) || 0;
        if (n < 0) n += this.length;
        if (n < 0 || n >= this.length) return undefined;
        return this[n];
      },
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
  if (!String.prototype.at) {
    Object.defineProperty(String.prototype, 'at', {
      value: function(n) {
        n = Math.trunc(n) || 0;
        if (n < 0) n += this.length;
        if (n < 0 || n >= this.length) return undefined;
        return this[n];
      },
      writable: true,
      enumerable: false,
      configurable: true
    });
  }
})();
