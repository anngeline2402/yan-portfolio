/* Reveal-on-scroll + staggered pop. data-reveal to reveal; data-delay="120" (ms);
   add data-pop to also play a pop sound when it appears. */
(function(){
  var els = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){ els.forEach(function(e){ e.classList.add('in'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){
        var el=en.target, d=parseFloat(el.getAttribute('data-delay')||0);
        setTimeout(function(){
          el.classList.add('in');
          if(el.hasAttribute('data-pop') && window.YANSound) window.YANSound.pop();
        }, d);
        io.unobserve(el);
      }
    });
  }, { threshold:0.18, rootMargin:'0px 0px -8% 0px' });
  els.forEach(function(e){ io.observe(e); });
})();
