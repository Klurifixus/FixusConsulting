/* Fixus Consulting — motion & interaction */
(function(){
  'use strict';

  /* ============================================================
     BOOKING CONFIG — the one line to edit to go live
     ------------------------------------------------------------
     Kalenderbokning är uppskjuten tills vidare. Tills dess fångar
     varje "Boka ett samtal" / "Begär offert"-knapp en intresse-
     anmälan via e-post (förifyllt namn/telefon) så Pierre kan
     ringa upp — exakt det flöde vi valt för nu.

     När du vill aktivera kalendern: klistra in din Google Calendar
     appointment-scheduling-länk i BOOKING_URL nedan, så pekas alla
     knappar om dit automatiskt. Lämna den tom ('') för e-postflödet.
     ============================================================ */
  var BOOKING_URL = '';                                            // ← din Google Calendar-bokningslänk (senare)
  var BOOKING_FALLBACK = 'mailto:Pirrefixus@gmail.com'
    + '?subject=' + encodeURIComponent('Intresseanmälan – Fixus Consulting')
    + '&body=' + encodeURIComponent(
        'Hej Pierre!\n\n' +
        'Jag vill veta mer om Fixus Consulting och bli uppringd.\n\n' +
        'Namn:\n' +
        'Företag:\n' +
        'Telefon:\n' +
        'Kort om behovet:\n'
      );

  /* Wire every booking CTA to a single destination. The design ships
     with placeholder hrefs (REPLACE_WITH_YOUR_BOOKING_LINK); this
     rewrites them all at once. Runs immediately because this script
     is loaded at the end of <body>, so the DOM is already parsed. */
  (function wireBooking(){
    var useUrl = BOOKING_URL && BOOKING_URL.indexOf('REPLACE_WITH') === -1;
    var dest = useUrl ? BOOKING_URL : BOOKING_FALLBACK;
    var external = /^https?:/i.test(dest);
    var links = document.querySelectorAll('a[href*="REPLACE_WITH_YOUR_BOOKING_LINK"]');
    Array.prototype.forEach.call(links, function(a){
      a.setAttribute('href', dest);
      if(external){ a.setAttribute('target','_blank'); a.setAttribute('rel','noopener'); }
      else { a.removeAttribute('target'); a.removeAttribute('rel'); }
    });
  })();

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- nav scroll state --- */
  var nav = document.querySelector('.nav');
  function scrollTop(){ return window.scrollY || window.pageYOffset || (document.scrollingElement||document.documentElement).scrollTop || 0; }
  function onScroll(){
    if(scrollTop() > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true, capture:true});
  document.addEventListener('scroll', onScroll, {passive:true, capture:true});
  onScroll();

  /* --- hero arrow draw + reveal on load --- */
  var hero = document.querySelector('.hero');
  // measure arrow path lengths for dash animation
  document.querySelectorAll('.hero-arrow path').forEach(function(p){
    try{ var len = p.getTotalLength(); p.style.setProperty('--len', len); }catch(e){}
  });
  requestAnimationFrame(function(){ if(hero) hero.classList.add('in'); });

  /* --- generic reveal (observer + scroll fallback, fail-safe) --- */
  var revs = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showEl(el){ el.classList.add('in'); }
  function checkReveals(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for(var i=revs.length-1;i>=0;i--){
      var el=revs[i];
      var r=el.getBoundingClientRect();
      if(r.top < vh*0.92 && r.bottom > 0){ showEl(el); revs.splice(i,1); }
    }
  }
  if(reduce){
    revs.forEach(showEl); revs.length=0;
  } else {
    if('IntersectionObserver' in window){
      var ro = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){ showEl(e.target); ro.unobserve(e.target);
            var k=revs.indexOf(e.target); if(k>-1) revs.splice(k,1); }
        });
      }, {threshold:0.14, rootMargin:'0px 0px -7% 0px'});
      revs.forEach(function(el){ ro.observe(el); });
    }
    // scroll/resize fallback covers any container that owns the scroll
    var rafQ=false;
    function onAny(){ if(rafQ) return; rafQ=true; requestAnimationFrame(function(){ checkReveals(); rafQ=false; }); }
    window.addEventListener('scroll', onAny, {passive:true, capture:true});
    window.addEventListener('resize', onAny, {passive:true});
    document.addEventListener('scroll', onAny, {passive:true, capture:true});
    checkReveals();
    // ultimate backstop: nothing stays hidden
    setTimeout(checkReveals, 1200);
    setTimeout(function(){ revs.forEach(showEl); }, 4000);
  }

  /* --- scroll-driven process steps --- */
  var steps = Array.prototype.slice.call(document.querySelectorAll('.pstep'));
  var paNum = document.querySelector('.pa-num .nval');
  var paLabel = document.querySelector('.pa-label');
  var tracks = Array.prototype.slice.call(document.querySelectorAll('.pa-track .tk'));
  var labels = steps.map(function(s){ return s.getAttribute('data-label') || ''; });

  function setActive(i){
    steps.forEach(function(s,idx){ s.classList.toggle('on', idx===i); });
    tracks.forEach(function(t,idx){ t.classList.toggle('on', idx<=i); });
    if(paNum) paNum.textContent = (i+1<10?'0':'')+(i+1);
    if(paLabel) paLabel.textContent = labels[i] || '';
  }

  if(steps.length){
    var current = 0, hovering = false;
    setActive(0);
    if('IntersectionObserver' in window){
      var so = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){
            var i = steps.indexOf(e.target);
            if(i>-1){ current=i; if(!hovering) setActive(i); }
          }
        });
      }, {threshold:0.55, rootMargin:'-20% 0px -30% 0px'});
      steps.forEach(function(s){ so.observe(s); });
    }
    // hover-scrub: the aside (number/label/track) follows the pointer, then
    // snaps back to the scroll-driven step when the pointer leaves
    steps.forEach(function(s, i){
      s.addEventListener('mouseenter', function(){ hovering = true; setActive(i); });
      s.addEventListener('mouseleave', function(){ hovering = false; setActive(current); });
    });
  }

  /* --- subtle portrait parallax (hero) --- */
  var portrait = document.querySelector('.hero .portrait');
  if(portrait && !reduce){
    var ticking=false;
    function px(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var y = Math.min(scrollTop(), 600);
        portrait.style.transform = 'translateY('+(y*0.06)+'px)';
        ticking=false;
      });
    }
    window.addEventListener('scroll', px, {passive:true, capture:true});
    document.addEventListener('scroll', px, {passive:true, capture:true});
  }

  /* --- scroll progress + active nav + mobile CTA --- */
  var progress = document.querySelector('.progress span');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var mobileCta = document.querySelector('.mobile-cta');
  var sectionMap = navLinks.map(function(a){
    var id = a.getAttribute('href');
    return { a:a, el: id && id.charAt(0)==='#' ? document.querySelector(id) : null };
  }).filter(function(x){ return x.el; });

  function docHeight(){ return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); }
  function onMaster(){
    var st = scrollTop();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if(progress){
      var max = docHeight() - vh;
      progress.style.transform = 'scaleX(' + (max>0 ? Math.min(1, st/max) : 0) + ')';
    }
    // active nav
    var probe = st + vh*0.32;
    var activeEl = null;
    for(var i=0;i<sectionMap.length;i++){
      var top = sectionMap[i].el.getBoundingClientRect().top + st;
      if(top <= probe) activeEl = sectionMap[i];
    }
    navLinks.forEach(function(a){ a.classList.remove('active'); });
    if(activeEl) activeEl.a.classList.add('active');
    // mobile CTA after hero
    if(mobileCta && hero){
      if(st > hero.offsetHeight - 120) mobileCta.classList.add('show');
      else mobileCta.classList.remove('show');
    }
  }
  var mTick=false;
  function masterQ(){ if(mTick) return; mTick=true; requestAnimationFrame(function(){ onMaster(); mTick=false; }); }
  window.addEventListener('scroll', masterQ, {passive:true, capture:true});
  document.addEventListener('scroll', masterQ, {passive:true, capture:true});
  window.addEventListener('resize', masterQ, {passive:true});
  onMaster();

  /* --- mobile menu --- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  function closeMenu(){ if(toggle){toggle.classList.remove('open');} if(menu){menu.classList.remove('open');} document.body.style.overflow=''; }
  if(toggle && menu){
    toggle.addEventListener('click', function(){
      var open = toggle.classList.toggle('open');
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  }

  /* --- year --- */
  var yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
})();
