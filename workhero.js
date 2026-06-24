/* Work page — the WORK pieces fly in and snap together.
   A "snap" plays the moment each piece locks into place, and a final
   "solve" chord plays once all three are connected. */
(function(){
  var wrap=document.getElementById('workPuzzle'); if(!wrap) return;
  var pieces=[].slice.call(wrap.querySelectorAll('.wp')); if(!pieces.length) return;

  function assemble(){
    if(wrap.classList.contains('assembled')) return;
    wrap.classList.add('assembled');
    var done=0;
    pieces.forEach(function(p){
      var locked=false;
      function lock(e){
        if(locked || (e && e.propertyName && e.propertyName!=='transform')) return;
        locked=true; done++;
        if(window.YANSound) YANSound.snap();                  // a piece connects
        if(done===pieces.length && window.YANSound){
          setTimeout(function(){ YANSound.solve(); }, 140);   // all connected
        }
      }
      p.addEventListener('transitionend', lock);
      setTimeout(lock, 1800); // fallback if transitionend doesn't fire
    });
  }

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ assemble(); io.disconnect(); } });
    }, { threshold:0.3 });
    io.observe(wrap);
  } else { setTimeout(assemble, 450); }
})();
