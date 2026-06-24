/* YAN hero — box opens, pieces jump out, drag to connect, name reveal */
(function(){
  var AR = 3003/1863;
  var CFG = [
    {id:1, rl:0.000, rt:0.080, rw:0.273, rh:0.920, hx:0.05, hy:0.30, rot:-12},
    {id:2, rl:0.279, rt:0.000, rw:0.381, rh:0.558, hx:0.60, hy:0.05, rot:11},
    {id:3, rl:0.661, rt:0.080, rw:0.339, rh:0.478, hx:0.63, hy:0.34, rot:8}
  ];

  function magicSnap(){ if(window.YANSound) YANSound.snap(); }
  function magicSolve(){ if(window.YANSound) YANSound.solve(); }
  var stage=document.getElementById('stage');
  if(!stage) return;
  var base=document.getElementById('boxBase'), lid=document.getElementById('boxLid');
  var placed=0, active=null, offX=0, offY=0, opened=false, playable=false, p_lidClosedY, p_lidOpenY;

  CFG.forEach(function(p){
    p.node=document.getElementById('piece'+p.id);
    p.ghost=document.getElementById('g'+p.id);
    p.dot=document.getElementById('d'+p.id);
  });

  function layout(){
    var W=stage.clientWidth;
    var aW=W*0.60, aH=aW/AR, aX=(W-aW)/2, aY=W*0.06;
    var bW=W*0.50, bH=bW*0.46, bX=(W-bW)/2, bY=W*0.42;
    var lidH=bW*0.17, H=bY+bH+8;
    stage.style.height=H+'px';
    base.style.width=bW+'px'; base.style.height=bH+'px'; base.style.left=bX+'px'; base.style.top=bY+'px';
    p_lidClosedY=bY-lidH*0.5; p_lidOpenY=bY-bH*0.95;
    lid.style.width=bW+'px'; lid.style.height=lidH+'px'; lid.style.left=bX+'px';
    lid.style.top=(opened?p_lidOpenY:p_lidClosedY)+'px';
    if(opened) lid.style.transform='translateY(-8px) rotate(-3deg)';
    var mouthX=W/2, mouthY=bY+8;
    CFG.forEach(function(p){
      p.w=p.rw*aW; p.h=p.rh*aH;
      p.tx=aX+p.rl*aW; p.ty=aY+p.rt*aH;
      p.ghost.style.cssText+=';width:'+p.w+'px;height:'+p.h+'px;left:'+p.tx+'px;top:'+p.ty+'px';
      p.node.style.width=p.w+'px'; p.node.style.height=p.h+'px';
      p.homeX=Math.max(0,Math.min(W-p.w,p.hx*W));
      p.homeY=Math.max(0,Math.min(H-p.h,p.hy*H));
      if(p.done){
        p.node.style.left=p.tx+'px'; p.node.style.top=p.ty+'px'; p.node.style.transform='none'; p.node.style.opacity=1;
      } else {
        p.node.style.left=p.homeX+'px'; p.node.style.top=p.homeY+'px';
        if(playable){ p.node.style.transform='none'; p.node.style.opacity=1; }
        else{
          var dx=mouthX-(p.homeX+p.w/2), dy=mouthY-(p.homeY+p.h/2);
          p.node.style.transform='translate('+dx+'px,'+dy+'px) scale(.4)'; p.node.style.opacity=0;
        }
      }
    });
  }

  function openBox(){
    if(opened) return; opened=true; if(window.YANSound){YANSound.ensure();YANSound.startMusic();}
    lid.classList.add('open'); lid.style.top=p_lidOpenY+'px'; lid.style.transform='translateY(-8px) rotate(-3deg)';
    document.getElementById('hintBig').innerHTML='Drag the pieces together&nbsp;&#10022;';
    document.getElementById('hintSmall').textContent='snap all three to reveal the name';
    document.getElementById('dots').style.display='flex';
    document.getElementById('skip').style.display='inline-block';
    CFG.forEach(function(p,i){
      setTimeout(function(){
        p.node.classList.add('out');
        p.node.style.transition='transform .7s cubic-bezier(.34,1.55,.6,1),opacity .3s';
        p.node.style.transform='none'; p.node.style.opacity=1; p.ghost.classList.add('show');
        if(window.YANSound) YANSound.jump();
      }, 240+i*150);
    });
    setTimeout(function(){
      playable=true;
      CFG.forEach(function(p){ p.node.style.transition='left .2s,top .2s,transform .2s'; });
    }, 240+3*150+700);
  }

  function pt(e){ if(e.touches&&e.touches[0])return{x:e.touches[0].clientX,y:e.touches[0].clientY}; return{x:e.clientX,y:e.clientY}; }
  function down(p,e){ if(!playable||p.done)return; active=p; var r=p.node.getBoundingClientRect(),q=pt(e);
    offX=q.x-r.left; offY=q.y-r.top; p.node.classList.add('dragging'); p.node.style.transition='none'; p.node.style.zIndex=40; e.preventDefault(); }
  function move(e){ if(!active)return; var sr=stage.getBoundingClientRect(),q=pt(e);
    active.node.style.left=(q.x-sr.left-offX)+'px'; active.node.style.top=(q.y-sr.top-offY)+'px'; active.node.style.transform='none'; e.preventDefault(); }
  function up(){ if(!active)return; var p=active; active=null; p.node.classList.remove('dragging');
    var x=parseFloat(p.node.style.left),y=parseFloat(p.node.style.top);
    if(Math.hypot(x-p.tx,y-p.ty)<Math.max(p.w,p.h)*0.5) place(p); else p.node.style.zIndex=24; }
  function place(p){ if(p.done)return; p.done=true; placed++;
    p.node.style.transition='left .25s cubic-bezier(.34,1.4,.64,1),top .25s cubic-bezier(.34,1.4,.64,1),transform .25s';
    p.node.style.left=p.tx+'px'; p.node.style.top=p.ty+'px'; p.node.style.transform='none';
    p.node.classList.add('placed','pop'); p.node.style.zIndex=22; p.ghost.classList.add('gone'); p.dot.classList.add('on'); magicSnap();
    setTimeout(function(){p.node.classList.remove('pop');},430);
    if(placed===3) setTimeout(solve,420); }
  function solve(){ magicSolve(); document.getElementById('hint').classList.add('gone'); document.getElementById('reveal').classList.add('show'); }

  lid.addEventListener('click',openBox);
  lid.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();openBox();} });
  CFG.forEach(function(p){
    p.node.addEventListener('mousedown',function(e){down(p,e);});
    p.node.addEventListener('touchstart',function(e){down(p,e);},{passive:false});
    p.node.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&playable){e.preventDefault();place(p);} });
  });
  window.addEventListener('mousemove',move,{passive:false});
  window.addEventListener('touchmove',move,{passive:false});
  window.addEventListener('mouseup',up); window.addEventListener('touchend',up);
  document.getElementById('skip').addEventListener('click',function(){ if(playable) CFG.forEach(function(p){ if(!p.done) place(p); }); });
  window.addEventListener('resize',layout);
  layout();
})();
