/* Fixus Consulting — motion & interaction */
(function(){
  'use strict';

  /* ============================================================
     BOOKING CONFIG — en rad att ändra
     ------------------------------------------------------------
     Varje "Boka ett första samtal" leder tills vidare till
     uppdragsbeskrivnings-formuläret (uppdragsbeskrivning.html), så
     att Pierre får in underlag (kontakt + uppdrag) INNAN första
     kontakten — bättre data inför samtalet än en ren bokning.

     Vill du i stället peka knapparna mot en Google Calendar-
     bokningslänk: klistra in den i BOOKING_URL nedan, så pekas alla
     knappar om dit automatiskt. Lämna den tom ('') för formulärflödet.
     ============================================================ */
  var BOOKING_URL = '';                                            // ← (valfritt) Google Calendar-bokningslänk

  /* Boknings-CTA:erna pekar redan i HTML:en på uppdragsbeskrivning.html
     (alltid giltig länk, ingen placeholder i rå-HTML). Om BOOKING_URL sätts
     till en riktig kalenderlänk pekas varje [data-booking]-knapp om dit i
     stället. Körs direkt — skriptet ligger sist i <body>. */
  (function wireBooking(){
    if(!BOOKING_URL || BOOKING_URL.indexOf('REPLACE_WITH') !== -1) return;  // behåll formulär-länkarna
    var links = document.querySelectorAll('a[data-booking]');
    Array.prototype.forEach.call(links, function(a){
      a.setAttribute('href', BOOKING_URL);
      if(/^https?:/i.test(BOOKING_URL)){ a.setAttribute('target','_blank'); a.setAttribute('rel','noopener'); }
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

  /* --- yrkeskarusell (arrows + drag + native swipe) --- */
  var carousel = document.querySelector('.carousel');
  if(carousel){
    var ctrack = carousel.querySelector('.carousel-track');
    var cScope = carousel.closest('section') || document;   // buttons live in .roller-head, a sibling of .carousel
    var cPrev = cScope.querySelector('.cbtn.prev');
    var cNext = cScope.querySelector('.cbtn.next');
    function cUpdate(){
      var max = ctrack.scrollWidth - ctrack.clientWidth - 1;
      var x = ctrack.scrollLeft;
      if(cPrev) cPrev.disabled = x <= 0;
      if(cNext) cNext.disabled = x >= max;
      carousel.classList.toggle('at-start', x <= 0);
      carousel.classList.toggle('at-end', x >= max);
    }
    function page(dir){ ctrack.scrollBy({ left: dir * ctrack.clientWidth * 0.85, behavior: 'smooth' }); }
    if(cPrev) cPrev.addEventListener('click', function(){ page(-1); });
    if(cNext) cNext.addEventListener('click', function(){ page(1); });
    var cQ=false;
    ctrack.addEventListener('scroll', function(){ if(cQ) return; cQ=true; requestAnimationFrame(function(){ cUpdate(); cQ=false; }); }, {passive:true});
    window.addEventListener('resize', cUpdate, {passive:true});
    cUpdate();
    // drag-to-scroll with a mouse (touch uses native scrolling)
    var cDown=false, cStartX=0, cStartL=0;
    ctrack.addEventListener('pointerdown', function(e){
      if(e.pointerType === 'touch') return;
      cDown=true; cStartX=e.clientX; cStartL=ctrack.scrollLeft;
      ctrack.style.cursor='grabbing';
      try{ ctrack.setPointerCapture(e.pointerId); }catch(_){}
    });
    ctrack.addEventListener('pointermove', function(e){ if(!cDown) return; ctrack.scrollLeft = cStartL - (e.clientX - cStartX); });
    function cEnd(){ if(!cDown) return; cDown=false; ctrack.style.cursor=''; }
    ctrack.addEventListener('pointerup', cEnd);
    ctrack.addEventListener('pointercancel', cEnd);
  }

  /* --- lightbox: klick för att förstora en bild (t.ex. HazardLink-affischen) --- */
  (function(){
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-zoom]'));
    if(!triggers.length) return;
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Förstorad bild');
    box.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Stäng">×</button>' +
      '<img alt="" />' +
      '<span class="lightbox-hint">Klicka var som helst eller tryck Esc för att stänga</span>';
    document.body.appendChild(box);
    var img = box.querySelector('img');
    var closeBtn = box.querySelector('.lightbox-close');
    var lastFocus = null;
    function open(src, alt){
      img.setAttribute('src', src);
      img.setAttribute('alt', alt || '');
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
      lastFocus = document.activeElement;
      closeBtn.focus();
    }
    function close(){
      box.classList.remove('open');
      document.body.style.overflow = '';
      if(lastFocus && lastFocus.focus){ lastFocus.focus(); }
    }
    triggers.forEach(function(t){
      t.addEventListener('click', function(){
        open(t.getAttribute('data-zoom'), t.getAttribute('data-zoom-alt'));
      });
    });
    box.addEventListener('click', close);   // backdrop, bild eller stäng-knapp
    document.addEventListener('keydown', function(e){
      if((e.key === 'Escape' || e.key === 'Esc') && box.classList.contains('open')) close();
    });
  })();

  /* --- year --- */
  var yr = document.getElementById('yr');
  if(yr) yr.textContent = new Date().getFullYear();
})();
