/* Work-page cards: hover reveals each project's motion graphic video.
   On touch devices (no hover), a video instead plays automatically once
   its card has sat mostly in view for 3 seconds — i.e. the visitor has
   stopped scrolling on that project.
   Falls back silently to the static cover image if a video is missing,
   still loading, or the visitor prefers reduced motion. */
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
  var cards = [].slice.call(document.querySelectorAll(".card"));
  if (!cards.length) return;

  var DWELL_MS = 3000;

  cards.forEach(function (card) {
    var vid = card.querySelector(".thumb-vid");
    if (!vid || !vid.getAttribute("src")) return;

    vid.addEventListener("loadeddata", function () {
      card.classList.add("vid-ready");
    });
    vid.addEventListener("error", function () {
      card.classList.remove("vid-ready");
    });

    function play() {
      if (reduce) return;
      if (vid.readyState < 2) vid.load();
      var p = vid.play();
      if (p && p.catch)
        p.catch(function () {
          /* autoplay blocked, cover stays visible */
        });
    }
    function stop() {
      vid.pause();
      try {
        vid.currentTime = 0;
      } catch (e) {}
    }

    if (isTouch) {
      /* dwell-to-play: start a 3s timer while the card is mostly visible,
         cancel it if the visitor scrolls past before the timer completes */
      var dwellTimer = null;
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                dwellTimer = setTimeout(function () {
                  card.classList.add("touch-playing");
                  play();
                }, DWELL_MS);
              } else {
                clearTimeout(dwellTimer);
                card.classList.remove("touch-playing");
                stop();
              }
            });
          },
          { threshold: 0.6 }
        );
        io.observe(card);
      }
    } else {
      /* desktop/pointer devices: real hover + keyboard focus */
      card.addEventListener("mouseenter", play);
      card.addEventListener("mouseleave", stop);
      card.addEventListener("focus", play);
      card.addEventListener("blur", stop);
    }
  });
})();