      mapboxgl.accessToken = mapToken;
      const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: booking.geometry.coordinates, // starting position [lng, lat]
        zoom: 8, // starting zoom
        projection: 'globe' // display the map as a 3D globe
        });
        map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
      });

      // Create a default Marker and add it to the map.
      const marker1 = new mapboxgl.Marker()
      .setLngLat(booking.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({offset: 15})
        .setHTML(`<h5>${booking.title}</h5><h6>${booking.location}</h6>`)
      )
      .addTo(map);