$(function() {
  function initAutocomplete() {
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

    const importantDays = [
      {
        key: "dayBeforeYesterday",
        weekday: weekdays[weekdayNum === 0 ? 5 : weekdayNum - 2],
        color: "lightgreen"
      },
      {
        key: "yesterday",
        weekday: weekdays[weekdayNum === 0 ? 6 : weekdayNum - 1],
        color: "green"
      },
      { key: "today", weekday: weekdays[weekdayNum], color: "red" },
      {
        key: "tomorrow",
        weekday: weekdays[weekdayNum === 6 ? 0 : weekdayNum + 1],
        color: "red"
      },
      {
        key: "dayAfterTomorrow",
        weekday: weekdays[weekdayNum === 6 ? 1 : weekdayNum + 2],
        color: "orange"
      }
    ];

    // FIRST AND SECOND PART OF URL
    const maxFeatures = 1000;
    const firstStockUrl =
      "https://openparking.stockholm.se/LTF-Tolken/v1/servicedagar/weekday/";
    const lastStockUrl = "?outputFormat=json&apiKey=";
    const sthmlApiKey = "31be1dc0-8e91-41ff-b9f3-33fe1208c1d6&maxFeatures="+maxFeatures;
    // ====== REQUEST YESTERDAY'S, TODAY'S, AND TOMORROWS INFO ==== //
    importantDays.map((importantDay, i) => {
      $.ajax({
        type: "GET",
        url: firstStockUrl + importantDay.weekday + lastStockUrl + sthmlApiKey,
        dataType: "jsonp",
        async: false
      }).done(function(data) {
        if (!data) {
          return;
        }
        colorize(data.features, importantDay);

      });
    });

    // ====== ADD ELEMENTS TO LIST ===== //
    colorize = (features, importantDay) => {
      features.forEach(feature => {
        // $(`div.omraden ul[data-day=${importantDay.key}]`).prepend(
        //   `<li >${feature.properties.ADDRESS}</li>`
        // );
        // CALL FUNCTION TO DRAW A LINE WITH SPECIFIC COLOR
        console.log(importantDay.color, feature.geometry.coordinates);
        colorizeStreet(importantDay.color, feature.geometry.coordinates);
      });
    };

    const googleApiKey = "AIzaSyBWagNfi1z8VDkcHSS2dXlzgTPpDNby3Qg";
    // MAP
    // ============= GOOGLE MAPS API =========== //

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

    // DRAW LINES OF DIFFERENT COLORS DEPENDING ON DAY
    function colorizeStreet(color, coords) {
      const streetCoordinates = [];

      coords.forEach(pair => {
        const obj =  {
          lat : pair[1],
          lng : pair[0]
        }

        streetCoordinates.push(obj);
      });
      console.log(streetCoordinates);
      const coloredPath = new google.maps.Polyline({
        path: streetCoordinates,
        geodesic: true,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      coloredPath.setMap(map);
    }
  }
  initAutocomplete();
});
