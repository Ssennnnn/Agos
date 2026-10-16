(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var emergencyForm = document.querySelector(".emergency-form");

  if (emergencyForm) {
    var checkButton = emergencyForm.querySelector(".btn-submit-report");
    var formStatus = emergencyForm.querySelector(".form-status");

    checkButton.addEventListener("click", function () {
      var fields = emergencyForm.querySelectorAll("input, select, textarea");

      for (var i = 0; i < fields.length; i++) {
        if (!fields[i].reportValidity()) return;
      }

      formStatus.textContent = "Required fields are complete, but no report was sent. This form is not connected to emergency services. If you are in immediate danger, call 911.";
      formStatus.hidden = false;
    });
  }

  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || "0", 10);
    var duration = 1400;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var revealTargets = document.querySelectorAll(".stat, .card, .news-card, .panel, .phase, .help-panel");
  revealTargets.forEach(function (el, i) {
    el.classList.add("reveal");
    el.style.transitionDelay = (i % 3) * 90 + "ms";
  });

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add("is-visible");
      el.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach(function (el) { io.observe(el); });
})();
