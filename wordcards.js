/* Work-page cards: hover reveals each project's motion graphic video.
   Falls back silently to the static cover image if a video is missing,
   still loading, or the visitor prefers reduced motion. */
(function () {
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cards = [].slice.call(document.querySelectorAll(".card"));
  if (!cards.length) return;

  cards.forEach(function (card) {
    var vid = card.querySelector(".thumb-vid");
    if (!vid || !vid.getAttribute("src")) return;

    vid.addEventListener("loadeddata", function () {
      card.classList.add("vid-ready");
    });
    vid.addEventListener("error", function () {
      card.classList.remove("vid-ready");
    });

    function enter() {
      if (reduce) return;
      if (vid.readyState < 2) vid.load();
      var p = vid.play();
      if (p && p.catch)
        p.catch(function () {
          /* autoplay blocked, cover stays visible */
        });
    }
    function leave() {
      vid.pause();
      try {
        vid.currentTime = 0;
      } catch (e) {}
    }

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);
    card.addEventListener("focus", enter);
    card.addEventListener("blur", leave);
  });
})();
