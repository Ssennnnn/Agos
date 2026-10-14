(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var dialog = document.getElementById("emergency-dialog");

  document.querySelectorAll("[data-open-emergency]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        window.location.href = "tel:911";
      }
    });
  });

  if (dialog) {
    dialog.addEventListener("click", function (e) {
      var r = dialog.getBoundingClientRect();
      var inside = e.clientX >= r.left && e.clientX <= r.right &&
                   e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dialog.close();
    });
  }

  var emergencyForm = document.querySelector(".emergency-form");

  if (emergencyForm) {
    emergencyForm.addEventListener("submit", function (e) {
      if (!emergencyForm.checkValidity()) {
        e.preventDefault();
        alert("Please fill in all required fields before submitting your emergency report.");
        return;
      }

      alert("Your emergency report has been submitted.");
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


