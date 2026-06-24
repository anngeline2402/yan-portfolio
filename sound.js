/* YANSound — pop sound effects + soft synthesized garden ambient + mute.
   Audio can only start after a user gesture, so we kick it off on first click/tap. */
window.YANSound = (function(){
  var ctx=null, music=null, muted=false, started=false;

  function ensure(){
    if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
    if(ctx && ctx.state==='suspended'){ ctx.resume(); }
  }
  function tone(freqs, gap, dur, vol, type){
    if(!ctx || muted) return;
    var now=ctx.currentTime;
    freqs.forEach(function(f,i){
      var o=ctx.createOscillator(), g=ctx.createGain();
      o.type=type||'triangle'; o.frequency.value=f;
      var s=now+i*(gap||0.05);
      g.gain.setValueAtTime(0.0001,s);
      g.gain.exponentialRampToValueAtTime(vol||0.2,s+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,s+(dur||0.5));
      o.connect(g); g.connect(ctx.destination); o.start(s); o.stop(s+(dur||0.5)+0.05);
    });
  }
  function pop(){ tone([659.25,987.77],0.045,0.32,0.16); }
  function snap(){ tone([880,1174.7,1568],0.05,0.5,0.2); }
  function solve(){ tone([523.25,659.25,783.99,1046.5,1318.5],0.085,0.6,0.22); }
  /* springy "boing" as a puzzle piece jumps out of the box */
  function jump(){
    if(!ctx || muted) return;
    var now=ctx.currentTime, o=ctx.createOscillator(), g=ctx.createGain();
    o.type='triangle';
    o.frequency.setValueAtTime(300, now);
    o.frequency.exponentialRampToValueAtTime(780, now+0.13);
    o.frequency.exponentialRampToValueAtTime(560, now+0.26);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.17, now+0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now+0.34);
    o.connect(g); g.connect(ctx.destination); o.start(now); o.stop(now+0.38);
  }

  function startMusic(){
    ensure(); if(!ctx || started) return; started=true;
    music=ctx.createGain(); music.gain.value=muted?0:0.0;
    music.connect(ctx.destination);
    // gentle fade-in
    music.gain.linearRampToValueAtTime(muted?0:0.11, ctx.currentTime+2.5);
    // soft wind = low-passed noise
    var n=2*ctx.sampleRate, buf=ctx.createBuffer(1,n,ctx.sampleRate), d=buf.getChannelData(0);
    for(var i=0;i<n;i++) d[i]=Math.random()*2-1;
    var noise=ctx.createBufferSource(); noise.buffer=buf; noise.loop=true;
    var lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=480;
    var ng=ctx.createGain(); ng.gain.value=0.05;
    noise.connect(lp); lp.connect(ng); ng.connect(music); noise.start();
    // warm pad chord (very quiet, sustained)
    [220,277.18,329.63].forEach(function(f){
      var o=ctx.createOscillator(); o.type='sine'; o.frequency.value=f;
      var g=ctx.createGain(); g.gain.value=0.018;
      o.connect(g); g.connect(music); o.start();
    });
    scheduleBird();
  }
  function scheduleBird(){
    if(!ctx) return;
    setTimeout(function(){ chirp(); scheduleBird(); }, (2.5+Math.random()*6)*1000);
  }
  function chirp(){
    if(!ctx || muted || !music) return;
    var now=ctx.currentTime, base=1500+Math.random()*1300, n=2+Math.floor(Math.random()*3);
    for(var i=0;i<n;i++){
      var o=ctx.createOscillator(), g=ctx.createGain();
      o.type='sine'; var s=now+i*0.085, f=base*(1+(Math.random()*0.3-0.15));
      o.frequency.setValueAtTime(f,s); o.frequency.exponentialRampToValueAtTime(f*1.4,s+0.06);
      g.gain.setValueAtTime(0.0001,s);
      g.gain.exponentialRampToValueAtTime(0.045,s+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001,s+0.12);
      o.connect(g); g.connect(music); o.start(s); o.stop(s+0.16);
    }
  }
  function toggleMute(){
    muted=!muted;
    if(music) music.gain.setTargetAtTime(muted?0:0.11, ctx.currentTime, 0.2);
    return muted;
  }

  // start ambient on the very first interaction anywhere
  function kick(){ ensure(); startMusic(); window.removeEventListener('pointerdown',kick); window.removeEventListener('keydown',kick); }
  window.addEventListener('pointerdown', kick);
  window.addEventListener('keydown', kick);

  return { ensure:ensure, pop:pop, snap:snap, solve:solve, jump:jump, startMusic:startMusic, toggleMute:toggleMute, isMuted:function(){return muted;} };
})();

/* wire any .sound-toggle button on the page */
document.addEventListener('DOMContentLoaded', function(){
  var btns=document.querySelectorAll('.sound-toggle');
  btns.forEach(function(btn){
    btn.addEventListener('click', function(){
      window.YANSound.ensure(); window.YANSound.startMusic();
      var m=window.YANSound.toggleMute();
      btn.classList.toggle('muted', m);
      btn.setAttribute('aria-label', m?'Unmute music':'Mute music');
      btn.querySelector('.on').style.display = m?'none':'block';
      btn.querySelector('.off').style.display = m?'block':'none';
    });
  });
});
