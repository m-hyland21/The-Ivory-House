/* Rooms page - small jQuery interactions specific to this page
   the shared script.js handles the reveal-on-scroll across all pages */

$(document).ready(function () {

  // click any row in the comparison table to highlight it
  // click again to un-highlight
  $(".comparison tbody tr").on("click", function () {
    const $row = $(this);
    const wasHighlighted = $row.hasClass("row-highlight");

    // clear all rows first so only one is highlighted at a time
    $(".comparison tbody tr").removeClass("row-highlight");

    if (!wasHighlighted) {
      $row.addClass("row-highlight");
    }
  });

});