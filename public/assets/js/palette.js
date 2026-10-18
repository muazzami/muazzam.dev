// Command palette: Ctrl/⌘K or "/" to jump anywhere on the page.
(function () {
  var dialog = document.querySelector('[data-palette]');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  var input = dialog.querySelector('[data-palette-input]');
  var empty = dialog.querySelector('[data-palette-empty]');
  var items = Array.prototype.slice.call(dialog.querySelectorAll('.palette__item'));
  var active = 0;

  function visible() { return items.filter(function (el) { return !el.parentElement.hidden; }); }

  function highlight() {
    var list = visible();
    items.forEach(function (el) { el.classList.remove('is-active'); });
    if (list[active]) {
      list[active].classList.add('is-active');
      list[active].scrollIntoView({ block: 'nearest' });
    }
  }

  function filter() {
    var q = input.value.trim().toLowerCase();
    items.forEach(function (el) {
      el.parentElement.hidden = q !== '' && el.textContent.toLowerCase().indexOf(q) === -1;
    });
    empty.hidden = visible().length > 0;
    active = 0;
    highlight();
  }

  function open() {
    input.value = '';
    filter();
    dialog.showModal();
    input.focus();
  }

  document.querySelectorAll('[data-palette-open]').forEach(function (b) { b.addEventListener('click', open); });

  document.addEventListener('keydown', function (e) {
    var typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !dialog.open)) {
      e.preventDefault();
      dialog.open ? dialog.close() : open();
    }
  });

  input.addEventListener('input', filter);
  input.addEventListener('keydown', function (e) {
    var list = visible();
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(active + 1, list.length - 1); highlight(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
    if (e.key === 'Enter' && list[active]) { e.preventDefault(); list[active].click(); }
  });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
    if (e.target.closest('a.palette__item')) dialog.close();
  });

  var themeBtn = dialog.querySelector('[data-theme-toggle]');
  themeBtn.addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (err) {}
    dialog.close();
  });
})();
