// RepoCMS demo: a form generated from intro.content edits the live intro.
(function () {
  var root = document.querySelector('[data-repo-demo]');
  if (!root) return;

  var form = root.querySelector('[data-form]');
  var fields = Array.prototype.slice.call(root.querySelectorAll('[data-field]'));
  var json = root.querySelector('[data-json]');
  var log = root.querySelector('[data-log]');
  var state = root.querySelector('[data-state]');
  var commitBtn = root.querySelector('[data-commit]');
  var resetBtn = root.querySelector('[data-reset]');
  var note = root.getAttribute('data-note') || '';
  var uploadPath = root.getAttribute('data-upload-path') || '/';
  var thumbs = Array.prototype.slice.call(root.querySelectorAll('[data-media]'));
  var upload = root.querySelector('[data-upload]');
  // Uploaded files stay in the browser: JSON shows a repo path, the page shows a blob URL.
  var blobs = {};

  var original = {};
  var committed = {};
  fields.forEach(function (f) {
    original[f.dataset.field] = f.value;
    committed[f.dataset.field] = f.value;
  });

  function current() {
    var out = {};
    fields.forEach(function (f) { out[f.dataset.field] = f.value; });
    return out;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function render() {
    var values = current();
    var changed = [];
    var lines = Object.keys(values).map(function (key, i, keys) {
      var value = JSON.stringify(values[key]);
      var dirty = values[key] !== committed[key];
      if (dirty) changed.push(key);
      var shown = dirty ? '<mark class="is-edited">' + escapeHtml(value) + '</mark>' : escapeHtml(value);
      return '  "' + key + '": ' + shown + (i < keys.length - 1 ? ',' : '');
    });
    json.innerHTML = '{\n' + lines.join('\n') + '\n}';

    Object.keys(values).forEach(function (key) {
      var dirty = values[key] !== committed[key];
      document.querySelectorAll('[data-bind="' + key + '"]').forEach(function (el) {
        el.textContent = values[key];
        el.classList.toggle('is-edited', dirty);
      });
      document.querySelectorAll('[data-bind-src="' + key + '"]').forEach(function (el) {
        var src = blobs[values[key]] || values[key];
        if (el.getAttribute('src') !== src) el.setAttribute('src', src);
        el.classList.toggle('is-edited', dirty);
      });
    });

    thumbs.forEach(function (t) {
      var field = t.closest('fieldset').querySelector('[data-field]');
      t.setAttribute('aria-pressed', String(t.dataset.media === field.value));
    });

    state.textContent = changed.length ? changed.length + ' unsaved change' + (changed.length > 1 ? 's' : '') : '';
    commitBtn.disabled = changed.length === 0;
    resetBtn.disabled = fields.every(function (f) { return f.value === original[f.dataset.field]; });
    return changed;
  }

  fields.forEach(function (f) { f.addEventListener('input', render); });

  thumbs.forEach(function (t) {
    t.addEventListener('click', function () {
      t.closest('fieldset').querySelector('[data-field]').value = t.dataset.media;
      render();
    });
  });

  if (upload) {
    upload.addEventListener('change', function () {
      var file = upload.files && upload.files[0];
      if (!file || !/^image\//.test(file.type)) return;
      var path = uploadPath + file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-');
      blobs[path] = URL.createObjectURL(file);
      upload.closest('fieldset').querySelector('[data-field]').value = path;
      upload.value = '';
      render();
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var changed = render();
    if (!changed.length) return;
    var hash = Math.random().toString(16).slice(2, 9);
    log.textContent = 'commit ' + hash + '\nUpdate ' + changed.map(function (k) { return 'intro.' + k; }).join(', ') + '\n\n' + note;
    committed = current();
    render();
  });

  resetBtn.addEventListener('click', function () {
    fields.forEach(function (f) { f.value = original[f.dataset.field]; });
    committed = Object.assign({}, original);
    log.textContent = '';
    render();
  });

  render();
})();
