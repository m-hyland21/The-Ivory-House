/* Ivory House - homepage JS
   jQuery handles all interactivity here, keeps it separate from the HTML */

$(document).ready(function () {

  // --- CURATED STAYS TABS ---
  // content for each tab stored in an object so the HTML stays clean
  const stayContent = {
    romantic: {
      title: "Romantic Escape",
      copy: "Ideal for couples seeking a peaceful, elegant stay with refined interiors, intimate dining, and a calm luxurious atmosphere."
    },
    business: {
      title: "Business Retreat",
      copy: "Designed for guests who value comfort, privacy, and a polished environment to relax after a productive day in the city."
    },
    weekend: {
      title: "Weekend Indulgence",
      copy: "Perfect for guests looking to unwind in style with spacious rooms, luxurious surroundings, and a memorable weekend experience."
    }
  };

  $(".stay-button").on("click", function () {
    const $clicked = $(this);
    const stayKey = $clicked.data("stay");
    const content = stayContent[stayKey];

    if (!content) return; // safety check

    // swap active class + aria-selected for a11y
    $(".stay-button")
      .removeClass("active-stay")
      .attr("aria-selected", "false");
    $clicked
      .addClass("active-stay")
      .attr("aria-selected", "true");

    // fade out, swap content, fade back in
    // NOTE: using the callback so the swap only happens AFTER fadeOut finishes,
    // otherwise you see the text change mid-fade
    $("#stay-result").fadeOut(250, function () {
      $(this).html(
        "<h3>" + content.title + "</h3>" +
        "<p>" + content.copy + "</p>"
      ).fadeIn(400);
    });
  });


  // --- HIGHLIGHTS ---
  // click a tile to slide down its detail text, click again to close
  $(".highlight-item").on("click", function () {
    const $clicked = $(this);
    const detailText = $clicked.data("detail");
    const $panel = $("#highlight-detail");
    const wasActive = $clicked.hasClass("is-active");

    $(".highlight-item").removeClass("is-active");

    // clicking the same one again = close the panel
    if (wasActive) {
      $panel.slideUp(300);
      return;
    }

    $clicked.addClass("is-active");

    // close, swap text, reopen (prevents flicker when switching tiles)
    $panel.slideUp(200, function () {
      $(this).text(detailText).slideDown(400);
    });
  });


  // --- ROOM CARDS ---
  // reveal extra info on hover (mouse) or focus (keyboard)
  // stop(true, true) stops any running animation so rapid hovers don't queue up
  $(".room-card").on("mouseenter focusin", function () {
    $(this).find(".room-card-hidden").stop(true, true).slideDown(300);
  });

  $(".room-card").on("mouseleave focusout", function () {
    $(this).find(".room-card-hidden").stop(true, true).slideUp(300);
  });


  // --- SCROLL REVEAL ---
  // fades sections in as they enter the viewport
  // trigger is 88% down the screen so it happens before the section is fully visible
  function revealOnScroll() {
    const triggerPoint = $(window).scrollTop() + $(window).height() * 0.88;

    $(".reveal").each(function () {
      if ($(this).offset().top < triggerPoint) {
        $(this).addClass("is-visible");
      }
    });

    // stagger the day-step cards so they come in one after another
    $(".day-step").each(function (index) {
      const $step = $(this);
      if (!$step.hasClass("is-visible") && $step.offset().top < triggerPoint) {
        setTimeout(function () {
          $step.addClass("is-visible");
        }, index * 150); // 150ms delay between each card
      }
    });
  }

  // run once on load (in case user lands mid-page) then on every scroll
  revealOnScroll();
  $(window).on("scroll resize", revealOnScroll);


  // --- SMOOTH SCROLL ---
  // for any internal # links - animates instead of jumping
  // TODO: might remove this if it feels laggy, test once more
  $('a[href^="#"]').on("click", function (event) {
    const target = $(this).attr("href");
    if (target === "#" || target.length < 2) return;

    const $target = $(target);
    if ($target.length) {
      event.preventDefault();
      $("html, body").animate({
        scrollTop: $target.offset().top - 80 // -80 to account for sticky header
      }, 600);
    }
  });

});