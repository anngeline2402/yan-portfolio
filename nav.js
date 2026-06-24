/* Nav: glassy in the hero, turns solid yellow after you scroll. */
(function(){
  var nav=document.querySelector('nav'); if(!nav) return;
  var hero=document.getElementById('hero')||document.querySelector('.work-hero');
  function thr(){ return hero ? Math.min(window.innerHeight*0.62, 520) : 40; }
  function upd(){ nav.classList.toggle('solid', window.scrollY > thr()); }
  upd(); window.addEventListener('scroll', upd, {passive:true});
  window.addEventListener('resize', upd);
})();
