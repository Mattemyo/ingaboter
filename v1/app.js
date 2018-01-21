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
      key: "dayBeforeYesterday",
      weekday: weekdays[weekdayNum === 0 ? 5 : weekdayNum - 2]
    },
    {
      key: "yesterday",
      weekday: weekdays[weekdayNum === 0 ? 6 : weekdayNum - 1]
    },
    { key: "today", weekday: weekdays[weekdayNum] },
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
  const lastStockUrl = "?outputFormat=json&apiKey=";
  const sthmlApiKey = "31be1dc0-8e91-41ff-b9f3-33fe1208c1d6&maxFeatures=5";
  // ====== REQUEST YESTERDAY'S, TODAY'S, AND TOMORROWS INFO ==== //
  importantDays.map((importantDay, i) => {
    $.ajax({
      type: "GET",
      url: firstStockUrl + importantDay.weekday + lastStockUrl + sthmlApiKey,
      dataType: "jsonp",
      async: false
    }).done(function(data) {
      appendToUl(data.features, importantDay);
      console.log(data.features[0]["geometry"]["coordinates"], i);
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
  // MAP
  function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById("map"), {
      // Stockholm in the Center
      center: {
        lat: 59.33,
        lng: 18.06
      },
      zoom: 10,
      mapTypeId: "roadmap"
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById("pc-input");
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location
          })
        );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    // DRAW LIGHT GREEN LINES ON DAY BEFORE YESTERDAY
    var flightPlanCoordinates = [
      { lat: 37.772, lng: -122.214 },
      { lat: 21.291, lng: -157.821 },
      { lat: -18.142, lng: 178.431 },
      { lat: -27.467, lng: 153.027 }
    ];
    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
  }

  initAutocomplete();
});
