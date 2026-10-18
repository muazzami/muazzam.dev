// Qafied demo: a local copy of the widget. Click anywhere to pin a comment.
(function () {
  var root = document.querySelector('[data-qafied]');
  if (!root) return;

  var toggle = root.querySelector('[data-qf-toggle]');
  var clearBtn = root.querySelector('[data-qf-clear]');
  var toast = root.querySelector('[data-qf-toast]');
  var output = root.querySelector('[data-qf-output]');
  var template = root.querySelector('[data-qf-form]');
  var html = document.documentElement;
  var active = false;
  var popover = null;
  var pins = [];

  // Toast and pins live on <body> so they position against the whole page.
  document.body.appendChild(toast);
  document.body.style.position = 'relative';

  function browser() {
    var ua = navigator.userAgent, m;
    if ((m = ua.match(/Edg\/([\d.]+)/))) return ['Edge', m[1]];
    if ((m = ua.match(/Firefox\/([\d.]+)/))) return ['Firefox', m[1]];
    if ((m = ua.match(/Chrome\/([\d.]+)/))) return ['Chrome', m[1]];
    if ((m = ua.match(/Version\/([\d.]+).*Safari/))) return ['Safari', m[1]];
    return ['Unknown', ''];
  }

  function os() {
    var ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) return 'iOS';
    if (/Android/.test(ua)) return 'Android';
    if (/Mac/.test(ua)) return 'macOS';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Linux/.test(ua)) return 'Linux';
    return 'Unknown';
  }

  function render() {
    output.textContent = pins.length
      ? JSON.stringify(pins.map(function (p) { return p.payload; }), null, 2)
      : root.dataset.empty;
    clearBtn.disabled = pins.length === 0;
  }

  function closePopover() {
    if (popover) { popover.remove(); popover = null; }
  }

  function setActive(on) {
    active = on;
    html.classList.toggle('qf-active', on);
    toast.hidden = !on;
    toggle.textContent = on ? root.dataset.stop : root.dataset.start;
    toggle.setAttribute('aria-pressed', String(on));
    if (!on) closePopover();
  }

  function openPopover(x, y) {
    closePopover();
    popover = template.content.firstElementChild.cloneNode(true);
    document.body.appendChild(popover);
    var maxX = document.documentElement.scrollWidth - popover.offsetWidth - 8;
    popover.style.left = Math.max(8, Math.min(x + 12, maxX)) + 'px';
    popover.style.top = y + 12 + 'px';
    popover.querySelector('textarea').focus();

    popover.querySelector('[data-qf-cancel]').addEventListener('click', closePopover);
    popover.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = new FormData(popover);
      var doc = document.documentElement;
      var b = browser();
      var payload = {
        site_key: 'demo',
        page_url: location.origin + location.pathname,
        type: form.get('type'),
        comment: String(form.get('comment')).trim(),
        x_pct: +(x / doc.scrollWidth * 100).toFixed(2),
        y_pct: +(y / doc.scrollHeight * 100).toFixed(2),
        browser: b[0],
        browser_version: b[1],
        os: os(),
        viewport: innerWidth + 'x' + innerHeight,
        screen: screen.width + 'x' + screen.height,
        status: 'open',
        created_at: new Date().toISOString(),
      };
      var pin = document.createElement('span');
      pin.className = 'qafied__pin';
      pin.textContent = String(pins.length + 1);
      pin.style.left = x + 'px';
      pin.style.top = y + 'px';
      document.body.appendChild(pin);
      pins.push({ el: pin, payload: payload });
      closePopover();
      render();
    });
  }

  toggle.addEventListener('click', function () { setActive(!active); });
  toast.querySelector('[data-qf-stop]').addEventListener('click', function () { setActive(false); });

  clearBtn.addEventListener('click', function () {
    pins.forEach(function (p) { p.el.remove(); });
    pins = [];
    render();
  });

  // Capture phase so links and buttons on the page don't fire while pinning.
  document.addEventListener('click', function (e) {
    if (!active) return;
    if (e.target.closest('[data-qf-popover], [data-qf-toast], [data-qf-toggle]')) return;
    e.preventDefault();
    e.stopPropagation();
    openPopover(e.pageX, e.pageY);
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !active) return;
    popover ? closePopover() : setActive(false);
  });

  render();
})();
