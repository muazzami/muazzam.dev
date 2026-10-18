// LineRichMenu demo: drag to draw tap areas, output LINE Messaging API JSON.
(function () {
  var root = document.querySelector('[data-richmenu]');
  if (!root) return;

  var W = 2500, H = 1686, MIN = 0.03;
  var stage = root.querySelector('[data-stage]');
  var output = root.querySelector('[data-output]');
  var areas = [];
  var drag = null;

  function grid() {
    var cols = [0, 833, 1667, 2500], rows = [0, 843, 1686], out = [];
    for (var r = 0; r < 2; r++) {
      for (var c = 0; c < 3; c++) {
        out.push({ x: cols[c], y: rows[r], width: cols[c + 1] - cols[c], height: rows[r + 1] - rows[r] });
      }
    }
    return out;
  }

  function box(a, cls, label) {
    var el = document.createElement('div');
    el.className = 'richmenu__area' + (cls ? ' ' + cls : '');
    el.style.left = (a.x / W) * 100 + '%';
    el.style.top = (a.y / H) * 100 + '%';
    el.style.width = (a.width / W) * 100 + '%';
    el.style.height = (a.height / H) * 100 + '%';
    if (label) el.textContent = label;
    return el;
  }

  function render() {
    stage.textContent = '';
    areas.forEach(function (a, i) { stage.appendChild(box(a, '', String(i + 1))); });
    output.textContent = JSON.stringify({
      size: { width: W, height: H },
      selected: false,
      name: 'Demo menu',
      chatBarText: 'Menu',
      areas: areas.map(function (a, i) {
        return { bounds: a, action: { type: 'message', text: 'Area ' + (i + 1) } };
      }),
    }, null, 2);
  }

  function point(e) {
    var r = stage.getBoundingClientRect();
    return {
      x: Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1),
      y: Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1),
    };
  }

  function rect(a, b) {
    var x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    return {
      x: Math.round(x * W), y: Math.round(y * H),
      width: Math.round(Math.abs(a.x - b.x) * W), height: Math.round(Math.abs(a.y - b.y) * H),
    };
  }

  stage.addEventListener('pointerdown', function (e) {
    stage.setPointerCapture(e.pointerId);
    drag = { start: point(e), el: null };
  });

  stage.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var r = rect(drag.start, point(e));
    if (drag.el) drag.el.remove();
    drag.el = box(r, 'richmenu__area--draft');
    stage.appendChild(drag.el);
  });

  function finish(e) {
    if (!drag) return;
    var end = point(e);
    if (Math.abs(end.x - drag.start.x) > MIN && Math.abs(end.y - drag.start.y) > MIN) {
      areas.push(rect(drag.start, end));
    }
    drag = null;
    render();
  }
  stage.addEventListener('pointerup', finish);
  stage.addEventListener('pointercancel', function () { drag = null; render(); });

  root.querySelector('[data-grid]').addEventListener('click', function () { areas = grid(); render(); });
  root.querySelector('[data-undo]').addEventListener('click', function () { areas.pop(); render(); });
  root.querySelector('[data-clear]').addEventListener('click', function () { areas = []; render(); });

  areas = grid();
  render();
})();
