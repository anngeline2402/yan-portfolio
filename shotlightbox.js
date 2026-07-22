/* Short Works carousel — clicking a poster opens it enlarged in a lightbox.
   Works for any .shot figure inside .marquee, including the duplicate
   loop set. Closes on backdrop click, close button, or Escape. */
(function () {
  var shots = [].slice.call(document.querySelectorAll(".shot"));
  if (!shots.length) return;

  // build the lightbox once
  var overlay = document.createElement("div");
  overlay.className = "shot-lightbox";
  overlay.innerHTML =
    '<div class="shot-lightbox-inner">' +
    '<img class="shot-lightbox-img" src="" alt="">' +
    '<figcaption class="shot-lightbox-cap"></figcaption>' +
    '<button class="shot-lightbox-close" aria-label="Close">&times;</button>' +
    "</div>";
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector(".shot-lightbox-img");
  var capEl = overlay.querySelector(".shot-lightbox-cap");
  var closeBtn = overlay.querySelector(".shot-lightbox-close");
  var lastFocused = null;

  function open(shot) {
    var img = shot.querySelector("img");
    var cap = shot.querySelector("figcaption");
    if (!img) return;
    imgEl.src = img.src;
    imgEl.alt = img.alt || "";
    capEl.textContent = cap ? cap.textContent.trim() : "";
    lastFocused = document.activeElement;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }
  function close() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  shots.forEach(function (shot) {
    shot.setAttribute("tabindex", "0");
    shot.setAttribute("role", "button");
    var cap = shot.querySelector("figcaption");
    shot.setAttribute(
      "aria-label",
      "View larger: " + (cap ? cap.textContent.trim() : "poster")
    );
    shot.addEventListener("click", function () {
      open(shot);
    });
    shot.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(shot);
      }
    });
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  closeBtn.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });
})();