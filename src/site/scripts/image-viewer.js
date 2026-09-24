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

    var controllers = viewer._dgZoomControllers;
    if (controllers && controllers.length) {
      for (var k = 0; k < controllers.length; k++) {
        controllers[k].reset();
      }
    } else {
      var images = viewer.querySelectorAll(".dg-image-viewer__slide img");
      for (var m = 0; m < images.length; m++) {
        resetTransform(images[m]);
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

  function applyTransform(img, scale, translateX, translateY) {
    img.style.transform = "translate(" + translateX + "px, " + translateY + "px) scale(" + scale + ")";
    img.style.transformOrigin = "center center";
  }

  function resetTransform(img) {
    img.style.transform = "";
  }

  function getDistance(touches) {
    var dx = touches[0].clientX - touches[1].clientX;
    var dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function isPortfolioMode() {
    return window.location.pathname.indexOf("/portfolio/") === 0;
  }

  function gardenListingHref() {
    var path = window.location.pathname.replace(/\/+$/, "");
    var slash = path.lastIndexOf("/");
    if (slash > 0) {
      return path.slice(0, slash + 1);
    }
    return "/";
  }

  function clampScale(value) {
    return Math.max(0.5, Math.min(5, value));
  }

  // Each image owns its own zoom/pan state so one image's transform can never
  // leak into another (the previous shared-state version blocked zoom/view for
  // every slide once the last image was scaled).
  function setupImageZoom(img) {
    var state = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      initialDistance: 0,
      initialScale: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
      startTranslateX: 0,
      startTranslateY: 0,
    };

    function updateTransform() {
      applyTransform(img, state.scale, state.translateX, state.translateY);
      if (state.scale > 1) {
        img.style.cursor = state.isDragging ? "grabbing" : "grab";
      } else {
        img.style.cursor = "zoom-in";
      }
    }

    img.addEventListener("wheel", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var delta = e.deltaY > 0 ? 0.9 : 1.1;
      state.scale = clampScale(state.scale * delta);
      if (state.scale <= 1) {
        state.translateX = 0;
        state.translateY = 0;
      }
      updateTransform();
    }, { passive: false });

    img.addEventListener("touchstart", function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        state.initialDistance = getDistance(e.touches);
        state.initialScale = state.scale;
      } else if (e.touches.length === 1 && state.scale > 1) {
        state.isDragging = true;
        state.startX = e.touches[0].clientX;
        state.startY = e.touches[0].clientY;
        state.startTranslateX = state.translateX;
        state.startTranslateY = state.translateY;
        updateTransform();
      }
    }, { passive: false });

    img.addEventListener("touchmove", function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var scaleChange = getDistance(e.touches) / state.initialDistance;
        state.scale = clampScale(state.initialScale * scaleChange);
        if (state.scale <= 1) {
          state.translateX = 0;
          state.translateY = 0;
        }
        updateTransform();
      } else if (e.touches.length === 1 && state.isDragging) {
        e.preventDefault();
        state.translateX = state.startTranslateX + (e.touches[0].clientX - state.startX);
        state.translateY = state.startTranslateY + (e.touches[0].clientY - state.startY);
        updateTransform();
      }
    }, { passive: false });

    img.addEventListener("touchend", function (e) {
      if (e.touches.length < 2) {
        state.initialDistance = 0;
      }
      if (e.touches.length === 0) {
        state.isDragging = false;
        updateTransform();
      }
    });

    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartTranslateX = 0;
    var dragStartTranslateY = 0;

    img.addEventListener("mousedown", function (e) {
      if (state.scale > 1) {
        e.preventDefault();
        state.isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartTranslateX = state.translateX;
        dragStartTranslateY = state.translateY;
        updateTransform();
      }
    });

    img.addEventListener("mousemove", function (e) {
      if (state.isDragging) {
        e.preventDefault();
        state.translateX = dragStartTranslateX + (e.clientX - dragStartX);
        state.translateY = dragStartTranslateY + (e.clientY - dragStartY);
        updateTransform();
      }
    });

    img.addEventListener("mouseup", function () {
      state.isDragging = false;
      updateTransform();
    });

    img.addEventListener("mouseleave", function () {
      if (state.isDragging) {
        state.isDragging = false;
        updateTransform();
      }
    });

    return {
      state: state,
      reset: function () {
        state.scale = 1;
        state.translateX = 0;
        state.translateY = 0;
        state.isDragging = false;
        resetTransform(img);
        img.style.cursor = "zoom-in";
      },
    };
  }

  function openZoomOverlay(imgSrc, imgAlt) {
    if (document.querySelector(".dg-image-viewer__zoom-overlay")) return;

    var overlay = document.createElement("div");
    overlay.className = "dg-image-viewer__zoom-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", imgAlt || "Zoomed image");

    var img = document.createElement("img");
    img.src = imgSrc;
    img.alt = imgAlt || "";
    img.className = "dg-image-viewer__zoom-img";

    overlay.appendChild(img);
    document.body.appendChild(overlay);
    document.body.classList.add("dg-image-viewer--zoomed");

    requestAnimationFrame(function () {
      overlay.classList.add("dg-image-viewer__zoom-overlay--visible");
    });

    var overlayZoom = {
      scale: 1,
      translateX: 0,
      translateY: 0,
      initialDistance: 0,
      initialScale: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
      startTranslateX: 0,
      startTranslateY: 0,
    };

    function updateOverlayTransform() {
      applyTransform(img, overlayZoom.scale, overlayZoom.translateX, overlayZoom.translateY);
      overlay.style.cursor = overlayZoom.scale > 1 ? "grab" : "zoom-out";
      if (overlayZoom.isDragging) {
        overlay.style.cursor = "grabbing";
      }
    }

    overlay.addEventListener("wheel", function (e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? 0.9 : 1.1;
      var newScale = Math.max(0.5, Math.min(5, overlayZoom.scale * delta));
      overlayZoom.scale = newScale;
      if (newScale <= 1) {
        overlayZoom.translateX = 0;
        overlayZoom.translateY = 0;
      }
      updateOverlayTransform();
    }, { passive: false });

    overlay.addEventListener("touchstart", function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        overlayZoom.initialDistance = getDistance(e.touches);
        overlayZoom.initialScale = overlayZoom.scale;
      } else if (e.touches.length === 1 && overlayZoom.scale > 1) {
        overlayZoom.isDragging = true;
        overlayZoom.startX = e.touches[0].clientX;
        overlayZoom.startY = e.touches[0].clientY;
        overlayZoom.startTranslateX = overlayZoom.translateX;
        overlayZoom.startTranslateY = overlayZoom.translateY;
        updateOverlayTransform();
      }
    }, { passive: false });

    overlay.addEventListener("touchmove", function (e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var currentDistance = getDistance(e.touches);
        var scaleChange = currentDistance / overlayZoom.initialDistance;
        var newScale = Math.max(0.5, Math.min(5, overlayZoom.initialScale * scaleChange));
        overlayZoom.scale = newScale;
        if (newScale <= 1) {
          overlayZoom.translateX = 0;
          overlayZoom.translateY = 0;
        }
        updateOverlayTransform();
      } else if (e.touches.length === 1 && overlayZoom.isDragging) {
        e.preventDefault();
        var dx = e.touches[0].clientX - overlayZoom.startX;
        var dy = e.touches[0].clientY - overlayZoom.startY;
        overlayZoom.translateX = overlayZoom.startTranslateX + dx;
        overlayZoom.translateY = overlayZoom.startTranslateY + dy;
        updateOverlayTransform();
      }
    }, { passive: false });

    overlay.addEventListener("touchend", function (e) {
      if (e.touches.length < 2) {
        overlayZoom.initialDistance = 0;
      }
      if (e.touches.length === 0) {
        overlayZoom.isDragging = false;
        updateOverlayTransform();
      }
    });

    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartTranslateX = 0;
    var dragStartTranslateY = 0;

    img.addEventListener("mousedown", function (e) {
      if (overlayZoom.scale > 1) {
        e.preventDefault();
        isDragging = true;
        overlayZoom.isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartTranslateX = overlayZoom.translateX;
        dragStartTranslateY = overlayZoom.translateY;
        updateOverlayTransform();
      }
    });

    overlay.addEventListener("mousemove", function (e) {
      if (isDragging) {
        e.preventDefault();
        var dx = e.clientX - dragStartX;
        var dy = e.clientY - dragStartY;
        overlayZoom.translateX = dragStartTranslateX + dx;
        overlayZoom.translateY = dragStartTranslateY + dy;
        updateOverlayTransform();
      }
    });

    overlay.addEventListener("mouseup", function () {
      isDragging = false;
      overlayZoom.isDragging = false;
      updateOverlayTransform();
    });

    overlay.addEventListener("mouseleave", function () {
      if (isDragging) {
        isDragging = false;
        overlayZoom.isDragging = false;
        updateOverlayTransform();
      }
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay && overlayZoom.scale <= 1) {
        closeZoomOverlay(overlay);
      } else if (e.target === img && overlayZoom.scale <= 1) {
        closeZoomOverlay(overlay);
      }
    });

    var escHandler = function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeZoomOverlay(overlay);
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
    overlay._escHandler = escHandler;
  }

  function closeZoomOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove("dg-image-viewer__zoom-overlay--visible");
    document.body.classList.remove("dg-image-viewer--zoomed");

    if (overlay._escHandler) {
      document.removeEventListener("keydown", overlay._escHandler);
    }

    setTimeout(function () {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 200);
  }

  function initViewer(viewer) {
    var slides = viewer.querySelectorAll(".dg-image-viewer__slide");
    var total = slides.length;
    if (total === 0) return;

    var index = 0;
    var isZoomed = false;

    var prevBtn = viewer.querySelector(".dg-image-viewer__prev");
    var nextBtn = viewer.querySelector(".dg-image-viewer__next");
    var backBtn = viewer.querySelector(".dg-image-viewer__back");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (isZoomed) return;
        if (index > 0) {
          index--;
          showSlide(viewer, index);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (isZoomed) return;
        if (index < total - 1) {
          index++;
          showSlide(viewer, index);
        }
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", function () {
        // Portfolio keeps the previous navigation behavior (browser history).
        // Garden mode returns to the note's listing (e.g. the drawings listing)
        // instead of whatever page the visitor happened to view last.
        if (isPortfolioMode()) {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = "/";
          }
        } else {
          window.location.href = gardenListingHref();
        }
      });
    }

    viewer.addEventListener("keydown", function (e) {
      if (isZoomed) return;
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

    var images = viewer.querySelectorAll(".dg-image-viewer__slide img");
    var zoomControllers = [];
    for (var i = 0; i < images.length; i++) {
      (function (img) {
        img.addEventListener("error", function () {
          handleImageError(this);
        });
        img.style.cursor = "zoom-in";

        var controller = setupImageZoom(img);
        zoomControllers.push(controller);

        img.addEventListener("click", function () {
          if (isZoomed) return;
          if (controller.state.scale > 1) return;
          var src = img.currentSrc || img.src;
          var alt = img.alt || "";
          openZoomOverlay(src, alt);
        });
      })(images[i]);
    }
    viewer._dgZoomControllers = zoomControllers;

    var zoomObserver = new MutationObserver(function () {
      isZoomed = !!document.querySelector(".dg-image-viewer__zoom-overlay");
    });
    zoomObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
      subtree: false,
    });

    updateButtons(viewer, index, total);
    updateCounter(viewer, index, total);
  }

  // Bound the viewer to the actual rendered viewport area so the whole
  // component (stage, captions, counter, buttons) always stays visible.
  function updateViewerSize(viewer) {
    var top = viewer.getBoundingClientRect().top;
    var available = window.innerHeight - top - 20;
    if (available < 200) {
      available = Math.max(window.innerHeight - 20, 200);
    }
    viewer.style.setProperty("--dg-viewer-max-height", Math.round(available) + "px");
  }

  function refreshViewerSizes() {
    var viewers = document.querySelectorAll("[data-dg-viewer]");
    for (var i = 0; i < viewers.length; i++) {
      updateViewerSize(viewers[i]);
    }
  }

  function initAll() {
    var viewers = document.querySelectorAll("[data-dg-viewer]");
    for (var i = 0; i < viewers.length; i++) {
      initViewer(viewers[i]);
    }
    refreshViewerSizes();
  }

  document.addEventListener("DOMContentLoaded", initAll);
  window.addEventListener("load", refreshViewerSizes);
  window.addEventListener("resize", refreshViewerSizes);
  window.addEventListener("orientationchange", refreshViewerSizes);

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
