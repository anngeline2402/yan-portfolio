/* Falling puzzle pieces — decorative background behind the homepage
   "PORTFOLIO" collage section. Runs continuously (loops) the whole
   time that section is in view, pauses when scrolled away, and each
   piece falls through and fades out at the bottom (like snow). */
(function () {
  var wrap = document.getElementById("puzzleFall");
  if (!wrap) return;
  var section = wrap.closest("section") || wrap.parentElement;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var PIECE_COUNT = 20; // how many source images exist
  var FLURRY = 26; // how many pieces on screen at once ("lively")

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (var i = 0; i < FLURRY; i++) {
    var img = document.createElement("img");
    var n = Math.floor(Math.random() * PIECE_COUNT);
    img.src = "assets/puzzle-drop/piece_" + String(n).padStart(2, "0") + ".png";
    img.alt = "";
    img.className = "pz-piece";

    var size = rand(70, 170); // px
    var left = rand(-2, 96); // %
    var duration = rand(8, 16); // s
    var delay = -rand(0, duration); // negative = already mid-fall on load
    var sway = rand(-40, 40); // px drift while falling

    img.style.setProperty("--pz-size", size + "px");
    img.style.setProperty("--pz-sway", sway + "px");
    img.style.left = left + "%";
    img.style.animationDuration = duration + "s";
    img.style.animationDelay = delay + "s";

    wrap.appendChild(img);
  }

  if ("IntersectionObserver" in window && section) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          wrap.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    io.observe(section);
  } else {
    // no IntersectionObserver support: just run it
    wrap.classList.add("is-active");
  }
})();