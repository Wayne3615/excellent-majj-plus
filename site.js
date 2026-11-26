/* Excellent Majj Plus Ltd, shared script.
   Requests are emailed to CONFIG.email (through formsubmit.co) and can also be sent on WhatsApp. */
var CONFIG = { whatsapp: "233554843688", email: "excellentmajjplus1962@gmail.com" };

(function () {
  var hd = document.querySelector('.hd'), mb = document.getElementById('menuBtn');
  if (hd && mb) {
    mb.addEventListener('click', function () {
      var o = hd.classList.toggle('open');
      mb.setAttribute('aria-expanded', o);
      document.body.style.overflow = o ? 'hidden' : '';
    });
    var cx = document.querySelector('[data-mm-close]');
    if (cx) cx.addEventListener('click', function () {
      hd.classList.remove('open');
      mb.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
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

  function waLink(text) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text);
  }

  document.querySelectorAll('[data-submit]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var form = btn.closest('[data-form]');
      var note = form.querySelector('[data-note]');
      var kind = form.getAttribute('data-form');
      var lines = ['NEW REQUEST: ' + kind];
      var fields = { _subject: 'Website request: ' + kind, _template: 'table', _captcha: 'false' };
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
        if (v) { lines.push(label + ': ' + v); fields[label] = v; }
        if (/email/i.test(label) && v) fields._replyto = v;
      });
      form.querySelectorAll('[data-group]').forEach(function (g) {
        var vals = [];
        g.querySelectorAll('input[type=checkbox]:checked').forEach(function (c) { vals.push(c.value); });
        if (vals.length) { lines.push(g.getAttribute('data-group') + ': ' + vals.join(', ')); fields[g.getAttribute('data-group')] = vals.join(', '); }
      });

      note.style.display = 'block';
      note.style.color = '';
      note.textContent = '';
      if (missing.length) {
        note.style.color = '#CE3235';
        note.textContent = 'Please fill in: ' + missing.join(', ') + '.';
        if (firstBad) firstBad.focus();
        return;
      }
      var text = lines.join('\n');

      function addWhatsApp(prefix) {
        note.textContent = prefix + ' ';
        var a = document.createElement('a');
        a.href = waLink(text);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Send it on WhatsApp too';
        a.style.cssText = 'color:#1E8E3E;font-weight:700;text-decoration:underline';
        note.appendChild(a);
      }

      btn.disabled = true;
      note.textContent = 'Sending your request...';
      fetch('https://formsubmit.co/ajax/' + CONFIG.email, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(fields)
      }).then(function (r) { return r.json(); }).then(function (j) {
        btn.disabled = false;
        if (j && (j.success === true || j.success === 'true')) {
          addWhatsApp('Thank you. Your request has been sent and we will contact you soon.');
        } else {
          addWhatsApp('We could not send this by email.');
        }
      }).catch(function () {
        btn.disabled = false;
        addWhatsApp('We could not send this by email. Please use WhatsApp, or call us on +233 (0)24 298 0278.');
      });
    });
  });
})();
