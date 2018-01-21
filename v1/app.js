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
  const importantDays = [
    {
      key: 'dayBeforeYesterday',
      weekday: weekdays[weekdayNum === 0 ? 5 : weekdayNum - 2]
    },
    {
      key: "yesterday",
      weekday: weekdays[weekdayNum === 0 ? 6 : weekdayNum - 1]
    },
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
    "?outputFormat=json&apiKey=";
  const sthmlApiKey = "31be1dc0-8e91-41ff-b9f3-33fe1208c1d6&maxFeatures=1";
  // ====== REQUEST YESTERDAY'S, TODAY'S, AND TOMORROWS INFO ==== //
  importantDays.map(importantDay => {
    console.log(importantDay.weekday);
    $.ajax({
      type: "GET",
      url: firstStockUrl + importantDay.weekday + lastStockUrl + sthmlApiKey,
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


// ============= GOOGLE MAPS API =========== //
const googleApiKey = "AIzaSyBWagNfi1z8VDkcHSS2dXlzgTPpDNby3Qg";

let map;
function initMap() {
  map = new googleApiKey.maps.Map($('#map'), {
    center: {lat: }
  })
}


});
