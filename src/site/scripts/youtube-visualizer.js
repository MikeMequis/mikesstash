(function () {
  var BANDS = 9;
  var FFT_SIZE = 256;
  var apiReady = false;
  var apiQueue = [];

  function loadYouTubeApi() {
    if (window.YT && window.YT.Player) {
      apiReady = true;
      apiQueue.splice(0).forEach(function (fn) {
        fn();
      });
      return;
    }
    if (document.getElementById("yt-iframe-api")) return;
    var tag = document.createElement("script");
    tag.id = "yt-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  window.onYouTubeIframeAPIReady = function () {
    apiReady = true;
    apiQueue.splice(0).forEach(function (fn) {
      fn();
    });
  };

  function themeColors() {
    var styles = getComputedStyle(document.body);
    return {
      start: (styles.getPropertyValue("--yt-viz-gradient-start") || "#000000").trim(),
      end: (styles.getPropertyValue("--yt-viz-gradient-end") || "#9bcf00").trim(),
      bg: (styles.getPropertyValue("--yt-viz-bg") || "transparent").trim(),
    };
  }

  function bandsFromFrequencyData(frequencyData, binCount) {
    var bands = [];
    for (var b = 0; b < BANDS; b++) {
      var start = Math.floor(Math.pow(b / BANDS, 1.6) * binCount);
      var end = Math.max(start + 1, Math.floor(Math.pow((b + 1) / BANDS, 1.6) * binCount));
      var peak = 0;
      for (var i = start; i < end && i < binCount; i++) {
        if (frequencyData[i] > peak) peak = frequencyData[i];
      }
      bands.push(peak / 255);
    }
    return bands;
  }

  function simulatedBands(time) {
    var bands = [];
    for (var j = 0; j < BANDS; j++) {
      var beat = Math.pow(Math.max(0, Math.sin(time * (2.6 + j * 0.38) + j * 0.7)), 2.8);
      var sway = (Math.sin(time * (1.3 + j * 0.17) + j) + 1) * 0.11;
      var jitter = Math.random() * 0.14;
      bands.push(Math.min(1, Math.max(0.05, 0.12 + beat * 0.58 + sway + jitter)));
    }
    return bands;
  }

  function resizeCanvas(canvas) {
    var rect = canvas.parentElement.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    return {
      ctx: canvas.getContext("2d"),
      width: rect.width,
      height: rect.height,
      dpr: dpr,
    };
  }

  function drawBars(canvasContext, displayWidth, displayHeight, targets, levels) {
    var colors = themeColors();
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.clearRect(0, 0, displayWidth, displayHeight);
    canvasContext.fillStyle = colors.bg;
    canvasContext.fillRect(0, 0, displayWidth, displayHeight);

    var gap = Math.max(4, displayWidth * 0.012);
    var barWidth = (displayWidth - gap * (BANDS + 1)) / BANDS;

    for (var i = 0; i < BANDS; i++) {
      var rate = targets[i] > levels[i] ? 0.55 : 0.18;
      levels[i] += (targets[i] - levels[i]) * rate;
      var barHeight = Math.max(2, levels[i] * displayHeight * 0.92);
      var x = gap + i * (barWidth + gap);
      var gradient = canvasContext.createLinearGradient(x, 0, x, barHeight);
      gradient.addColorStop(0, colors.start);
      gradient.addColorStop(1, colors.end);
      canvasContext.fillStyle = gradient;
      canvasContext.fillRect(x, 0, barWidth, barHeight);
    }
  }

  /**
   * Reference pattern:
   * arrayBuffer -> decodeAudioData -> BufferSource -> Analyser -> destination
   */
  function visualize(audioBuffer, audioContext, canvas) {
    var layout = resizeCanvas(canvas);
    var canvasContext = layout.ctx;
    canvasContext.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);

    var analyser = audioContext.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.75;

    var frequencyBufferLength = analyser.frequencyBinCount;
    var frequencyData = new Uint8Array(frequencyBufferLength);
    var levels = new Array(BANDS).fill(0);

    var source = null;
    var sourceGeneration = 0;
    var playing = false;
    var startOffset = 0;
    var startedAt = 0;

    analyser.connect(audioContext.destination);

    function stopSource() {
      sourceGeneration += 1;
      if (!source) return;
      var node = source;
      source = null;
      node.onended = null;
      try {
        node.stop(0);
      } catch (_err) {
        /* already stopped */
      }
      try {
        node.disconnect();
      } catch (_err2) {
        /* already disconnected */
      }
    }

    function play(offset) {
      stopSource();
      audioContext.resume();

      var nextOffset = Math.max(0, Math.min(offset || 0, audioBuffer.duration));
      var generation = sourceGeneration;
      var node = audioContext.createBufferSource();
      source = node;
      node.buffer = audioBuffer;
      node.connect(analyser);
      startOffset = nextOffset;
      startedAt = audioContext.currentTime;
      playing = true;

      node.onended = function () {
        if (generation !== sourceGeneration || source !== node) return;
        playing = false;
        source = null;
      };

      node.start(0, startOffset);
    }

    function pause() {
      if (playing && source) {
        startOffset += audioContext.currentTime - startedAt;
        startOffset = Math.max(0, Math.min(startOffset, audioBuffer.duration));
      }
      stopSource();
      playing = false;
    }

    function sync(offset) {
      var nextOffset = Math.max(0, Math.min(offset || 0, audioBuffer.duration));
      if (!playing) {
        startOffset = nextOffset;
        return;
      }

      var currentOffset = startOffset + (audioContext.currentTime - startedAt);
      if (Math.abs(currentOffset - nextOffset) < 0.35) return;
      play(nextOffset);
    }

    function draw() {
      requestAnimationFrame(draw);
      layout = resizeCanvas(canvas);
      canvasContext = layout.ctx;
      canvasContext.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);

      var targets;
      if (playing) {
        analyser.getByteFrequencyData(frequencyData);
        targets = bandsFromFrequencyData(frequencyData, frequencyBufferLength);
      } else {
        targets = new Array(BANDS).fill(0);
      }

      drawBars(canvasContext, layout.width, layout.height, targets, levels);
    }

    draw();

    return {
      play: play,
      pause: pause,
      sync: sync,
      destroy: function () {
        pause();
        try {
          analyser.disconnect();
        } catch (_err) {
          /* already disconnected */
        }
      },
    };
  }

  function visualizeSimulated(canvas, getTime) {
    var layout = resizeCanvas(canvas);
    var canvasContext = layout.ctx;
    var levels = new Array(BANDS).fill(0);
    var playing = false;

    function draw() {
      requestAnimationFrame(draw);
      layout = resizeCanvas(canvas);
      canvasContext = layout.ctx;
      canvasContext.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);

      var targets = playing ? simulatedBands(getTime()) : new Array(BANDS).fill(0);
      drawBars(canvasContext, layout.width, layout.height, targets, levels);
    }

    draw();

    return {
      setPlaying: function (next) {
        playing = next;
      },
    };
  }

  function fetchAudioArrayBuffer(videoId) {
    return fetch("/api/yt-audio/" + encodeURIComponent(videoId)).then(function (response) {
      if (!response.ok) throw new Error("Audio fetch failed");
      return response.arrayBuffer();
    });
  }

  function createYouTubePlayer(videoId, target, index, handlers) {
    var playerId = "yt-visualizer-player-" + index;
    target.id = playerId;
    target.hidden = false;

    function buildPlayer() {
      return new YT.Player(playerId, {
        videoId: videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin,
          mute: handlers.muted ? 1 : 0,
        },
        events: {
          onStateChange: handlers.onStateChange,
        },
      });
    }

    if (apiReady) return buildPlayer();
    return new Promise(function (resolve) {
      apiQueue.push(function () {
        resolve(buildPlayer());
      });
    });
  }

  async function mountPlayer(wrap, index) {
    var videoId = wrap.getAttribute("data-yt-id");
    var fallbackTarget = wrap.querySelector(".yt-visualizer-fallback");
    var canvas = wrap.querySelector(".yt-visualizer-canvas");
    var mediaEl = wrap.querySelector(".yt-visualizer-media");
    if (!videoId || !canvas || !fallbackTarget) return;

    if (mediaEl) mediaEl.hidden = true;
    wrap.classList.add("is-loading-audio");
    wrap.setAttribute("data-yt-audio-mode", "loading");
    loadYouTubeApi();

    try {
      var arrayBuffer = await fetchAudioArrayBuffer(videoId);
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
      var audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      var controller = visualize(audioBuffer, audioContext, canvas);

      var player = await createYouTubePlayer(videoId, fallbackTarget, index, {
        muted: true,
        onStateChange: function (event) {
          var state = event.data;
          if (state === YT.PlayerState.PLAYING) {
            try {
              controller.play(event.target.getCurrentTime());
            } catch (_err) {
              controller.play(0);
            }
            wrap.classList.add("is-playing");
          } else if (state === YT.PlayerState.BUFFERING) {
            controller.pause();
            wrap.classList.remove("is-playing");
          } else if (
            state === YT.PlayerState.PAUSED ||
            state === YT.PlayerState.ENDED
          ) {
            controller.pause();
            wrap.classList.remove("is-playing");
          }
        },
      });

      var lastYtTime = 0;
      var syncTimer = window.setInterval(function () {
        if (!wrap._ytVisualizer || wrap._ytVisualizer.player !== player) {
          window.clearInterval(syncTimer);
          return;
        }
        try {
          if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
            lastYtTime = player.getCurrentTime();
            return;
          }
          var ytTime = player.getCurrentTime();
          if (Math.abs(ytTime - lastYtTime) > 1.2) {
            controller.play(ytTime);
          }
          lastYtTime = ytTime;
        } catch (_err) {
          /* player not ready */
        }
      }, 400);

      wrap.classList.remove("is-loading-audio");
      wrap.setAttribute("data-yt-audio-mode", "buffer");
      wrap._ytVisualizer = {
        player: player,
        controller: controller,
        audioContext: audioContext,
        syncTimer: syncTimer,
      };
      return;
    } catch (_err) {
      wrap.classList.remove("is-loading-audio");
      wrap.setAttribute("data-yt-audio-mode", "youtube");
    }

    var sim = visualizeSimulated(canvas, function () {
      try {
        return wrap._ytVisualizer.player.getCurrentTime();
      } catch (_err) {
        return performance.now() / 1000;
      }
    });

    var fallbackPlayer = await createYouTubePlayer(videoId, fallbackTarget, index, {
      muted: false,
      onStateChange: function (event) {
        var playing = event.data === YT.PlayerState.PLAYING;
        sim.setPlaying(playing);
        wrap.classList.toggle("is-playing", playing);
      },
    });

    wrap._ytVisualizer = { player: fallbackPlayer, sim: sim };
  }

  function initYouTubeVisualizers() {
    var wraps = document.querySelectorAll(".yt-visualizer-player:not([data-yt-mounted])");
    if (!wraps.length) return;
    wraps.forEach(function (wrap, index) {
      wrap.setAttribute("data-yt-mounted", "true");
      mountPlayer(wrap, index);
    });
  }

  document.addEventListener("DOMContentLoaded", initYouTubeVisualizers);
  window.initYouTubeVisualizers = initYouTubeVisualizers;
})();
