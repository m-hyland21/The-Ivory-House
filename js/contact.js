/* Contact page - form validation + FAQ accordion
   two jQuery interactions, both substantial */

$(document).ready(function () {

  // =========================================================
  // 1. FORM VALIDATION
  // =========================================================

  // validation rules helper - returns error message string, or "" if valid
  function validateField(name, value, allValues) {
    const v = (value || "").trim();

    switch (name) {
      case "fullName":
        if (v === "") return "Please enter your full name.";
        if (v.length < 2) return "Name must be at least 2 characters.";
        if (!/\s/.test(v)) return "Please enter both your first and last name.";
        return "";

      case "email":
        if (v === "") return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
          return "Please enter a valid email address.";
        }
        return "";

      case "phone":
        if (v === "") return "";
        const digitCount = (v.match(/\d/g) || []).length;
        if (digitCount < 7) return "Please enter a valid phone number.";
        if (!/^[\d\s+\-()]+$/.test(v)) return "Phone number contains invalid characters.";
        return "";

      case "arrival":
        if (v === "") return "Please select an arrival date.";
        const arrivalDate = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (arrivalDate < today) return "Arrival date cannot be in the past.";
        return "";

      case "departure":
        if (v === "") return "Please select a departure date.";
        if (allValues.arrival) {
          const arr = new Date(allValues.arrival);
          const dep = new Date(v);
          if (dep <= arr) return "Departure must be after arrival.";
        }
        return "";

      case "guests":
        if (v === "") return "Please enter the number of guests.";
        const num = parseInt(v, 10);
        if (isNaN(num) || num < 1) return "Must be at least 1 guest.";
        if (num > 6) return "Maximum 6 guests per room.";
        return "";

      case "roomType":
        if (v === "") return "Please select a room type.";
        return "";

      default:
        return "";
    }
  }

  function showError($field, message) {
    const $errorSpan = $("#" + $field.attr("id") + "-error");
    if (message) {
      $field.addClass("is-invalid").attr("aria-invalid", "true");
      $errorSpan.text(message);
    } else {
      $field.removeClass("is-invalid").attr("aria-invalid", "false");
      $errorSpan.text("");
    }
  }

  function validateOne($field) {
    const name = $field.attr("name");
    const value = $field.val();
    const allValues = {
      arrival: $("#arrival").val(),
      departure: $("#departure").val()
    };
    const message = validateField(name, value, allValues);
    showError($field, message);
    return message === "";
  }

  function validateAll() {
    const fieldNames = ["fullName", "email", "phone", "arrival", "departure", "guests", "roomType"];
    let allValid = true;
    fieldNames.forEach(function (name) {
      const $field = $("#" + name);
      if (!validateOne($field)) {
        allValid = false;
      }
    });
    return allValid;
  }

  // live validation on blur
  $("#bookingForm input, #bookingForm select").on("blur", function () {
    validateOne($(this));
  });

  // live validation on change for date/select fields
  $("#arrival, #departure, #roomType, #guests").on("change", function () {
    validateOne($(this));
    // if arrival changes, re-check departure since it depends on arrival
    if ($(this).attr("id") === "arrival" && $("#departure").val()) {
      validateOne($("#departure"));
    }
  });

  // character counter for the textarea
  $("#specialRequests").on("input", function () {
    const length = $(this).val().length;
    $("#specialRequests-counter").text(length + " / 300");
  });


  // form submission
  $("#bookingForm").on("submit", function (e) {
    e.preventDefault();

    const isValid = validateAll();

    if (!isValid) {
      // scroll to the first error so the user sees it
      const $firstError = $(".is-invalid").first();
      if ($firstError.length) {
        $("html, body").animate({
          scrollTop: $firstError.offset().top - 120
        }, 400, function () {
          $firstError.focus();
        });
      }
      return;
    }

    // valid - collect data and show confirmation
    const data = {
      name: $("#fullName").val().trim(),
      email: $("#email").val().trim(),
      arrival: $("#arrival").val(),
      departure: $("#departure").val(),
      guests: $("#guests").val(),
      roomType: $("#roomType option:selected").text()
    };

    const formatDate = function (dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        weekday: "short", day: "numeric", month: "long", year: "numeric"
      });
    };

    const confirmationHtml =
      "<h3>Thank you, " + data.name + "</h3>" +
      "<p>We've received your enquiry for a <strong>" + data.roomType +
      "</strong> for <strong>" + data.guests + " guest(s)</strong>, arriving " +
      "<strong>" + formatDate(data.arrival) + "</strong> and departing " +
      "<strong>" + formatDate(data.departure) + "</strong>.</p>" +
      "<p>A confirmation will be sent to <strong>" + data.email + "</strong> within 24 hours.</p>";

    $("#formSuccess")
      .html(confirmationHtml)
      .prop("hidden", false)
      .hide()
      .slideDown(400);

    // hide the form itself
    $("#bookingForm").find(".form-field, .form-row, .form-submit, .form-intro").slideUp(400);

    setTimeout(function () {
      $("html, body").animate({
        scrollTop: $("#formSuccess").offset().top - 120
      }, 500);
    }, 400);
  });


  // =========================================================
  // 2. FAQ ACCORDION
  // =========================================================
  $(".faq-question").on("click", function () {
    const $button = $(this);
    const $item = $button.closest(".faq-item");
    const $answer = $item.find(".faq-answer");
    const wasOpen = $item.hasClass("is-open");

    // close all first
    $(".faq-item").removeClass("is-open");
    $(".faq-answer").slideUp(300);
    $(".faq-question").attr("aria-expanded", "false");

    // open the clicked one unless it was already open
    if (!wasOpen) {
      $item.addClass("is-open");
      $answer.slideDown(350);
      $button.attr("aria-expanded", "true");
    }
  });

});
