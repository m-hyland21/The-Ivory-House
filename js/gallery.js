/* Gallery page - filter, lightbox, keyboard nav
   three separate jQuery interactions all in one file */

$(document).ready(function () {

 // --- 1. CATEGORY FILTER ---
  // uses CSS class toggling instead of fadeOut/fadeIn
  // this lets the grid reflow smoothly during the transition
  $(".gallery-filter").on("click", function () {
    const $button = $(this);
    const filter = $button.data("filter");

    // active state + aria
    $(".gallery-filter")
      .removeClass("active-filter")
      .attr("aria-selected", "false");
    $button
      .addClass("active-filter")
      .attr("aria-selected", "true");

    // show all or only the matching category
    if (filter === "all") {
      $(".gallery-item").removeClass("filter-hidden");
    } else {
      $(".gallery-item").each(function () {
        const $item = $(this);
        if ($item.data("category") === filter) {
          $item.removeClass("filter-hidden");
        } else {
          $item.addClass("filter-hidden");
        }
      });
    }
  });


  // --- 2. LIGHTBOX ---
  // tracks which image is open so prev/next can navigate through them

  // build a list of all images so we can navigate by index
  const imageList = [];
  $(".gallery-item").each(function () {
    const $item = $(this);
    imageList.push({
      src: $item.find("img").attr("src"),
      alt: $item.find("img").attr("alt"),
      caption: $item.find(".gallery-caption").text(),
      category: $item.data("category")
    });
  });

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = imageList[index];

    $("#lightbox-image").attr("src", item.src).attr("alt", item.alt);
    $("#lightbox-caption").text(item.caption);
    $("#lightbox").prop("hidden", false);

    // prevent page scroll while lightbox is open
    $("body").css("overflow", "hidden");

    // move keyboard focus to the close button so Esc/Tab works naturally
    $("#lightbox-close").focus();
  }

  function closeLightbox() {
    $("#lightbox").prop("hidden", true);
    $("body").css("overflow", "");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % imageList.length;
    const item = imageList[currentIndex];
    // quick fade so the image change feels intentional
    $("#lightbox-image").fadeOut(150, function () {
      $(this).attr("src", item.src).attr("alt", item.alt).fadeIn(200);
    });
    $("#lightbox-caption").text(item.caption);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
    const item = imageList[currentIndex];
    $("#lightbox-image").fadeOut(150, function () {
      $(this).attr("src", item.src).attr("alt", item.alt).fadeIn(200);
    });
    $("#lightbox-caption").text(item.caption);
  }

  // click any thumbnail to open it
  $(".gallery-item").on("click", function () {
    const index = parseInt($(this).data("index"), 10);
    openLightbox(index);
  });

  // lightbox control buttons
  $("#lightbox-close").on("click", closeLightbox);
  $("#lightbox-next").on("click", showNext);
  $("#lightbox-prev").on("click", showPrev);

  // click the dark backdrop (but not the image itself) to close
  $("#lightbox").on("click", function (e) {
    if (e.target === this) closeLightbox();
  });


  // --- 3. KEYBOARD NAVIGATION ---
  // Esc to close, arrow keys to navigate - only when lightbox is open
  $(document).on("keydown", function (e) {
    if ($("#lightbox").prop("hidden")) return; // lightbox closed, ignore

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  });

});