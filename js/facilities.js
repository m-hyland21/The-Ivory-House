/* Facilities page - jQuery for the expand cards and FAQ accordion */

$(document).ready(function () {

  // --- FACILITY CARDS ---
  // click Learn More to slide the detail panel down
  $(".facility-toggle").on("click", function () {
    const $button = $(this);
    const $card = $button.closest(".facility-card");
    const $detail = $card.find(".facility-detail");
    const isOpen = $card.hasClass("is-open");

    if (isOpen) {
      // close this one
      $detail.slideUp(300);
      $card.removeClass("is-open");
      $button.attr("aria-expanded", "false").text("Learn More");
    } else {
      // open this one
      $detail.slideDown(400);
      $card.addClass("is-open");
      $button.attr("aria-expanded", "true").text("Show Less");
    }
  });


  // --- FAQ ACCORDION ---
  // only one FAQ open at a time (classic accordion pattern)
  $(".faq-question").on("click", function () {
    const $button = $(this);
    const $item = $button.closest(".faq-item");
    const $answer = $item.find(".faq-answer");
    const wasOpen = $item.hasClass("is-open");

    // close all first
    $(".faq-item").removeClass("is-open");
    $(".faq-answer").slideUp(300);
    $(".faq-question").attr("aria-expanded", "false");

    // open the clicked one (unless it was already open)
    if (!wasOpen) {
      $item.addClass("is-open");
      $answer.slideDown(350);
      $button.attr("aria-expanded", "true");
    }
  });

});