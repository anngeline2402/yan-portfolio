/* Smooth inertia scrolling (Lenis-style glide) — self-contained, no dependencies.
   Eased native scroll on desktop; mobile keeps its native momentum; respects reduced-motion. */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = matchMedia('(pointer: coarse)').matches;
  if(reduce || coarse) return;                 // leave touch + reduced-motion on native scroll

  document.documentElement.style.scrollBehavior='auto';
  var current=window.scrollY, target=current, ease=0.085, ticking=false;

  function maxScroll(){ return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  function clamp(v){ return Math.max(0, Math.min(v, maxScroll())); }
  function start(){ if(!ticking){ ticking=true; requestAnimationFrame(loop); } }
  function loop(){
    var d = target - current;
    current += d * ease;
    if(Math.abs(d) < 0.4){ current=target; window.scrollTo(0,current); ticking=false; return; }
    window.scrollTo(0, current);
    requestAnimationFrame(loop);
  }

  window.addEventListener('wheel', function(e){
    if(e.ctrlKey) return;                       // allow pinch-zoom
    if(e.target.closest && e.target.closest('.doc-viewer')) return;  // let inner viewers scroll natively
    e.preventDefault();
    target = clamp(target + e.deltaY * (e.deltaMode===1 ? 16 : 1));
    start();
  }, {passive:false});

  // keep in sync when the page is scrolled by other means (keyboard, scrollbar, jumps)
  window.addEventListener('scroll', function(){ if(!ticking){ current=target=window.scrollY; } }, {passive:true});
  window.addEventListener('resize', function(){ target=clamp(target); });

  // smooth anchor jumps (e.g. the scroll cue, "Contact")
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if(!a) return;
    var id = a.getAttribute('href'); if(id.length<2) return;
    var el = document.querySelector(id); if(!el) return;
    e.preventDefault();
    target = clamp(window.scrollY + el.getBoundingClientRect().top);
    start();
  });
})();
