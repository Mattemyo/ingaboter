$(function() {
  // ============  PARKING API ================= //
  const weekdayNum = new Date().getDay();
  const weekdays = [
    "söndag",
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lördag"
  ];
  // WEEEEEEEEK DAAAAAYS
  // TODO: Make sure yesterday is safe
  const importantDays = [
    {
      key: "today",
      weekday: weekdays[weekdayNum]
    },
    {
      key: "tomorrow",
      weekday: weekdays[weekdayNum === 6 ? 0 : weekdayNum + 1]
    },
    {
      key: "dayAfterTomorrow",
      weekday: weekdays[weekdayNum === 6 ? 1 : weekdayNum + 2]
    }
  ];

  // FIRST AND SECOND PART OF URL
  const firstStockUrl =
    "https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/weekday/";
  const lastStockUrl =
    "?outputFormat=json&apiKey=31be1dc0-8e91-41ff-b9f3-33fe1208c1d6&maxFeatures=5";

  // ====== REQUEST YESTERDAY'S, TODAY'S, AND TOMORROWS INFO ==== //
  importantDays.map(importantDay => {
    console.log(importantDay.weekday);
    $.ajax({
      type: "GET",
      url: firstStockUrl + importantDay.weekday + lastStockUrl,
      dataType: "jsonp",
      async: false
    }).done(function(data) {
      console.log(data.features);
      appendToUl(data.features, importantDay);
    });
  });




  // ====== ADD ELEMENTS TO LIST ===== //
  appendToUl = (data, importantDay) => {
    data.forEach(element => {
      $(`div.omraden ul[data-day=${importantDay.key}]`).prepend(
        `<li>${element.properties.ADDRESS}</li>`
      );
    });
  };
});
