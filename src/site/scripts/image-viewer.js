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

    var images = viewer.querySelectorAll(".dg-image-viewer__slide img");
    for (var k = 0; k < images.length; k++) {
      resetTransform(images[k]);
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
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = "/";
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
    for (var i = 0; i < images.length; i++) {
      images[i].addEventListener("error", function () {
        handleImageError(this);
      });
      images[i].style.cursor = "zoom-in";
      images[i].addEventListener("click", function () {
        if (isZoomed) return;
        if (imgZoom.scale > 1) return;
        var src = this.currentSrc || this.src;
        var alt = this.alt || "";
        openZoomOverlay(src, alt);
      });

      var imgZoom = {
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

      var img = images[i];

      function updateImgTransform() {
        applyTransform(img, imgZoom.scale, imgZoom.translateX, imgZoom.translateY);
        if (imgZoom.scale > 1) {
          img.style.cursor = "grab";
          if (imgZoom.isDragging) {
            img.style.cursor = "grabbing";
          }
        } else {
          img.style.cursor = "zoom-in";
        }
      }

      img.addEventListener("wheel", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var delta = e.deltaY > 0 ? 0.9 : 1.1;
        var newScale = Math.max(0.5, Math.min(5, imgZoom.scale * delta));
        imgZoom.scale = newScale;
        if (newScale <= 1) {
          imgZoom.translateX = 0;
          imgZoom.translateY = 0;
        }
        updateImgTransform();
      }, { passive: false });

      img.addEventListener("touchstart", function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          imgZoom.initialDistance = getDistance(e.touches);
          imgZoom.initialScale = imgZoom.scale;
        } else if (e.touches.length === 1 && imgZoom.scale > 1) {
          imgZoom.isDragging = true;
          imgZoom.startX = e.touches[0].clientX;
          imgZoom.startY = e.touches[0].clientY;
          imgZoom.startTranslateX = imgZoom.translateX;
          imgZoom.startTranslateY = imgZoom.translateY;
          updateImgTransform();
        }
      }, { passive: false });

      img.addEventListener("touchmove", function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          var currentDistance = getDistance(e.touches);
          var scaleChange = currentDistance / imgZoom.initialDistance;
          var newScale = Math.max(0.5, Math.min(5, imgZoom.initialScale * scaleChange));
          imgZoom.scale = newScale;
          if (newScale <= 1) {
            imgZoom.translateX = 0;
            imgZoom.translateY = 0;
          }
          updateImgTransform();
        } else if (e.touches.length === 1 && imgZoom.isDragging) {
          e.preventDefault();
          var dx = e.touches[0].clientX - imgZoom.startX;
          var dy = e.touches[0].clientY - imgZoom.startY;
          imgZoom.translateX = imgZoom.startTranslateX + dx;
          imgZoom.translateY = imgZoom.startTranslateY + dy;
          updateImgTransform();
        }
      }, { passive: false });

      img.addEventListener("touchend", function (e) {
        if (e.touches.length < 2) {
          imgZoom.initialDistance = 0;
        }
        if (e.touches.length === 0) {
          imgZoom.isDragging = false;
          updateImgTransform();
        }
      });

      var imgIsDragging = false;
      var imgDragStartX = 0;
      var imgDragStartY = 0;
      var imgDragStartTranslateX = 0;
      var imgDragStartTranslateY = 0;

      img.addEventListener("mousedown", function (e) {
        if (imgZoom.scale > 1) {
          e.preventDefault();
          imgIsDragging = true;
          imgZoom.isDragging = true;
          imgDragStartX = e.clientX;
          imgDragStartY = e.clientY;
          imgDragStartTranslateX = imgZoom.translateX;
          imgDragStartTranslateY = imgZoom.translateY;
          updateImgTransform();
        }
      });

      img.addEventListener("mousemove", function (e) {
        if (imgIsDragging) {
          e.preventDefault();
          var dx = e.clientX - imgDragStartX;
          var dy = e.clientY - imgDragStartY;
          imgZoom.translateX = imgDragStartTranslateX + dx;
          imgZoom.translateY = imgDragStartTranslateY + dy;
          updateImgTransform();
        }
      });

      img.addEventListener("mouseup", function () {
        imgIsDragging = false;
        imgZoom.isDragging = false;
        updateImgTransform();
      });

      img.addEventListener("mouseleave", function () {
        if (imgIsDragging) {
          imgIsDragging = false;
          imgZoom.isDragging = false;
          updateImgTransform();
        }
      });
    }

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
