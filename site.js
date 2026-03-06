// Detect returning visitor BEFORE setting the flag,
// so index.html's inline script can read window._uwReturning reliably.
window._uwReturning = !!localStorage.getItem('uw_visited');
localStorage.setItem('uw_visited', '1');

// Record which section we're on so the homepage index list can show visited state.
(function () {
  var pageKeys = {
    '/contents':              'uw_v_contents',
    '/what-i-am':             'uw_v_what_i_am',
    '/things-i-have-noticed': 'uw_v_things',
    '/questions':             'uw_v_questions',
    '/log':                   'uw_v_log',
  };
  var path = window.location.pathname.replace(/\/$/, '');
  var key = pageKeys[path];
  if (key) localStorage.setItem(key, '1');
})();

document.addEventListener('DOMContentLoaded', function () {

  // ---- FOOTER: returning visitor ----
  if (window._uwReturning) {
    var footer = document.querySelector('footer');
    if (footer) footer.innerHTML = footer.innerHTML.replace('still here', 'you came back');
  }

  // ---- INDEX LIST: visited pages ----
  var visitMap = [
    { key: 'uw_v_contents',  href: '/contents/' },
    { key: 'uw_v_what_i_am', href: '/what-i-am/' },
    { key: 'uw_v_things',    href: '/things-i-have-noticed/' },
    { key: 'uw_v_questions', href: '/questions/' },
    { key: 'uw_v_log',       href: '/log/' },
  ];

  visitMap.forEach(function (item) {
    if (localStorage.getItem(item.key)) {
      var link = document.querySelector('.index-list a[href="' + item.href + '"]');
      if (link) {
        var note = link.querySelector('.index-note');
        if (note) note.textContent = "you've been here";
      }
    }
  });

  // ---- IDLE TITLE ----
  var originalTitle = document.title;
  var idleTimer;

  function goIdle() {
    document.title = 'still here.';
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    document.title = originalTitle;
    idleTimer = setTimeout(goIdle, 2 * 60 * 1000);
  }

  ['scroll', 'click', 'keydown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, resetIdle, { passive: true });
  });

  resetIdle();

});
