(function () {
  function currentLang() {
    return document.body.classList.contains("lang-en") ? "en" : "pt";
  }

  function updateCounter(viewer, index, total) {
    var counterSpan = viewer.querySelector(".dg-image-viewer__counter span");
    if (!counterSpan) return;
    var lang = currentLang();
    var separator = counterSpan.getAttribute("data-counter-" + lang) || " / ";
    counterSpan.textContent = (index + 1) + separator + total;
  }

  function updateButtons(viewer, index, total) {
    var prev = viewer.querySelector(".dg-image-viewer__prev");
    var next = viewer.querySelector(".dg-image-viewer__next");
    if (prev) {
      prev.disabled = index === 0;
      prev.setAttribute("aria-disabled", index === 0 ? "true" : "false");
    }
    if (next) {
      next.disabled = index >= total - 1;
      next.setAttribute("aria-disabled", index >= total - 1 ? "true" : "false");
    }
  }

  function showSlide(viewer, index) {
    var slides = viewer.querySelectorAll(".dg-image-viewer__slide");
    var captions = viewer.querySelectorAll(".dg-image-viewer__caption-block");
    var total = slides.length;

    for (var i = 0; i < slides.length; i++) {
      if (i === index) {
        slides[i].removeAttribute("hidden");
      } else {
        slides[i].setAttribute("hidden", "");
      }
    }

    for (var j = 0; j < captions.length; j++) {
      if (j === index) {
        captions[j].removeAttribute("hidden");
      } else {
        captions[j].setAttribute("hidden", "");
      }
    }

    updateButtons(viewer, index, total);
    updateCounter(viewer, index, total);
  }

  function handleImageError(img) {
    var slide = img.closest(".dg-image-viewer__slide");
    if (slide) {
      slide.classList.add("dg-image-viewer__slide--broken");
    }
    img.alt = img.alt || "Image unavailable";
    img.removeAttribute("src");
    img.setAttribute("aria-label", "Image unavailable");
  }

  function initViewer(viewer) {
    var slides = viewer.querySelectorAll(".dg-image-viewer__slide");
    var total = slides.length;
    if (total === 0) return;

    var index = 0;

    var prevBtn = viewer.querySelector(".dg-image-viewer__prev");
    var nextBtn = viewer.querySelector(".dg-image-viewer__next");
    var backBtn = viewer.querySelector(".dg-image-viewer__back");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (index > 0) {
          index--;
          showSlide(viewer, index);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (index < total - 1) {
          index++;
          showSlide(viewer, index);
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "/";
        }
      });
    }

    viewer.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (index > 0) {
          index--;
          showSlide(viewer, index);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (index < total - 1) {
          index++;
          showSlide(viewer, index);
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        index = 0;
        showSlide(viewer, index);
      } else if (e.key === "End") {
        e.preventDefault();
        index = total - 1;
        showSlide(viewer, index);
      }
    });

    var images = viewer.querySelectorAll("img");
    for (var i = 0; i < images.length; i++) {
      images[i].addEventListener("error", function () {
        handleImageError(this);
      });
    }

    updateButtons(viewer, index, total);
    updateCounter(viewer, index, total);
  }

  function initAll() {
    var viewers = document.querySelectorAll("[data-dg-viewer]");
    for (var i = 0; i < viewers.length; i++) {
      initViewer(viewers[i]);
    }
  }

  document.addEventListener("DOMContentLoaded", initAll);

  var origApplyLang = window.applyLang;
  if (origApplyLang) {
    window.applyLang = function (lang) {
      origApplyLang(lang);
      var viewers = document.querySelectorAll("[data-dg-viewer]");
      for (var i = 0; i < viewers.length; i++) {
        var slides = viewers[i].querySelectorAll(".dg-image-viewer__slide");
        var activeSlide = viewers[i].querySelector(".dg-image-viewer__slide:not([hidden])");
        var index = activeSlide ? parseInt(activeSlide.getAttribute("data-slide-index"), 10) : 0;
        updateCounter(viewers[i], index, slides.length);
      }
    };
  }
})();
