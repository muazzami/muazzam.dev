// Small enhancements: Japan clock and the platform-correct shortcut hint.
(function () {
  var clock = document.querySelector('[data-clock]');
  if (clock) {
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Tokyo', weekday: 'short', hour: '2-digit', minute: '2-digit',
    });
    var tick = function () { clock.textContent = fmt.format(new Date()) + ' in Japan (UTC+9)'; };
    tick();
    setInterval(tick, 30000);
  }

  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('[data-kbd]').forEach(function (el) {
    el.textContent = isMac ? '⌘K' : 'Ctrl K';
  });
})();
