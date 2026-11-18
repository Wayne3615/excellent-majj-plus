/* Excellent Majj Plus Ltd, shared script.
   TO TURN ON WHATSAPP REQUESTS: put the company WhatsApp number below, digits only,
   with country code and no plus sign (example: "233241234567"). */
var CONFIG = { whatsapp: "", email: "info@excellentmajjplus.com" };

(function () {
  var hd = document.querySelector('.hd'), mb = document.getElementById('menuBtn');
  if (hd && mb) {
    mb.addEventListener('click', function () {
      var o = hd.classList.toggle('open');
      mb.setAttribute('aria-expanded', o);
    });
    document.querySelectorAll('.hd .nv a').forEach(function (a) {
      a.addEventListener('click', function () {
        hd.classList.remove('open');
        mb.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function labelFor(el, form) {
    var l = form.querySelector('label[for="' + el.id + '"]');
    return l ? l.textContent.replace('*', '').trim() : (el.getAttribute('data-label') || el.id);
  }

  document.querySelectorAll('[data-submit]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var form = btn.closest('[data-form]');
      var note = form.querySelector('[data-note]');
      var lines = ['NEW REQUEST: ' + form.getAttribute('data-form')];
      var missing = [], firstBad = null;

      form.querySelectorAll('input:not([type=checkbox]),select,textarea').forEach(function (el) {
        var v = (el.value || '').trim();
        var label = labelFor(el, form);
        el.style.borderColor = '';
        if (el.hasAttribute('data-required') && !v) {
          missing.push(label);
          el.style.borderColor = '#CE3235';
          if (!firstBad) firstBad = el;
        }
        if (v) lines.push(label + ': ' + v);
      });
      form.querySelectorAll('[data-group]').forEach(function (g) {
        var vals = [];
        g.querySelectorAll('input[type=checkbox]:checked').forEach(function (c) { vals.push(c.value); });
        if (vals.length) lines.push(g.getAttribute('data-group') + ': ' + vals.join(', '));
      });

      note.style.display = 'block';
      if (missing.length) {
        note.style.color = '#CE3235';
        note.textContent = 'Please fill in: ' + missing.join(', ') + '.';
        if (firstBad) firstBad.focus();
        return;
      }
      var text = lines.join('\n');
      if (CONFIG.whatsapp) {
        note.style.color = '';
        note.textContent = 'Opening WhatsApp. Press send there to finish your request.';
        window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank');
        return;
      }
      note.style.color = '';
      note.textContent = 'Online sending is not switched on yet. Please call or email us with these details.';
      try {
        navigator.clipboard.writeText(text).then(function () {
          note.textContent = 'Online sending is not switched on yet. Your request was copied. Paste it into a message to us on WhatsApp or email.';
        }, function () {});
      } catch (e) {}
    });
  });
})();
