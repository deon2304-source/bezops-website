// ===== BezOps website script =====
// Contact form endpoint — the BezOps contact route on the VoiceOps webhook
var CONTACT_ENDPOINT = 'https://voiceops-webhook.onrender.com/api/contact';

// Mobile menu
(function(){
  var btn = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ links.classList.remove('open'); });
  });
})();

// Contact forms
(function(){
  var params = new URLSearchParams(window.location.search);
  var fromUrl = params.get('product');

  document.querySelectorAll('form.contact-form').forEach(function(form){
    var select = form.querySelector('select[name="product"]');
    if (select && fromUrl) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value.toLowerCase() === fromUrl.toLowerCase()) { select.selectedIndex = i; }
      }
    }

    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      button.disabled = true;
      var original = button.textContent;
      button.textContent = 'Sending...';

      var payload = {};
      new FormData(form).forEach(function(v, k){ payload[k] = v; });

      fetch(CONTACT_ENDPOINT, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' } })
        .then(function(res){
          if (res.ok) {
            form.reset();
            if (select && fromUrl) { select.value = fromUrl; }
            status.className = 'form-status ok';
            status.textContent = 'Thank you — your message is on its way. We will get back to you within one business day.';
          } else {
            return res.json().catch(function(){ return {}; }).then(function(j){ var e = new Error('send'); e.userMessage = j && j.message; throw e; });
          }
        })
        .catch(function(err){
          status.className = 'form-status err';
          status.textContent = (err && err.userMessage) || 'Sorry, something went wrong sending your message. Please try again or email info@bezops.com.';
        })
        .then(function(){ button.disabled = false; button.textContent = original; });
    });
  });
})();

// Footer year
(function(){
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
