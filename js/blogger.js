const cachebuster = Math.floor(Date.now() / 1000);
const bloggerv3_url = 'https://api.roadtripsandhikes.org/wrapper/bloggerApiGetLatestPost/?'+cachebuster;
// const bloggerv3_url = 'http://localhost:8000/wrapper/bloggerApiGetLatestPost/?'+cachebuster;

function loadMap(lng,lat,name,token) {
// The value for 'accessToken' begins with 'pk...'
  mapboxgl.accessToken = token;
  const map = new mapboxgl.Map({
    container: 'map',
    // Replace YOUR_STYLE_URL with your style URL.
    style: 'mapbox://styles/mapbox/cjaudgl840gn32rnrepcb9b9g',
    center: [lng, lat],
    zoom: 9.7
  });
  map.addControl(new mapboxgl.FullscreenControl());
  const nav = new mapboxgl.NavigationControl({
    showCompass: false,
    showZoom: true
  });
  map.addControl(nav, 'bottom-right');

  map.on('load', () => {
  // Add an image to use as a custom marker
  map.loadImage(
      'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
      (error, image) => {
          if (error) throw error;
          map.addImage('custom-marker', image);
          // Add a GeoJSON source with 2 points
          map.addSource('points', {
              'type': 'geojson',
              'data': {
                  'type': 'FeatureCollection',
                  'features': [
                  {
                      // feature for Mapbox DC
                      'type': 'Feature',
                      'geometry': {
                          'type': 'Point',
                          'coordinates': [
                              lng, lat
                          ]
                  },
                      'properties': {
                          'title': name
                      }
                  },
                  // {
                  //       // feature for Mapbox SF
                  //       'type': 'Feature',
                  //       'geometry': {
                  //       'type': 'Point',
                  //           'coordinates': [-122.414, 37.776]
                  //       },
                  //       'properties': {
                  //           'title': 'Mapbox SF'
                  //       }
                  // }
                ]
              }
          });

          // Add a symbol layer
          map.addLayer({
              'id': 'points',
              'type': 'symbol',
              'source': 'points',
              'layout': {
                  'icon-image': 'custom-marker',
                  // get the title name from the source's "title" property
                  'text-field': ['get', 'title'],
                  'text-font': [
                      'Open Sans Semibold',
                      'Arial Unicode MS Bold'
                  ],
                  'text-offset': [0, 1.25],
                  'text-anchor': 'top'
              }
          });
      }
  );
  });

  map.on('load', () => {
     map.addSource('dem', {
         'type': 'raster-dem',
         'url': 'mapbox://mapbox.mapbox-terrain-dem-v1'
     });
     map.addLayer(
         {
             'id': 'hillshading',
             'source': 'dem',
             'type': 'hillshade'
             // insert below waterway-river-canal-shadow;
             // where hillshading sits in the Mapbox Outdoors style
         },
         'waterway-river-canal-shadow'
     );
  });
}


function getLatestPost() {
  axios.get(bloggerv3_url)
  .then(function (response) {
    // Show the blog section on successful load
    const blogSection = document.getElementById('blog_section');
    if (blogSection) {
      blogSection.classList.remove('hidden');
    }
    
    let resp = response.data;
    // console.log(resp);
    let image_url = resp.latest_post.image_url;
    let post_title = resp.latest_post.title;
    let post_published = JSON.stringify(resp.latest_post.published).slice(1,11);
    let post_url = resp.latest_post.post_url;
    var date_pub = new Date(post_published);
    var month = date_pub.getUTCMonth();
    var months = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    };
    var date = date_pub.getUTCDate();
    var year = date_pub.getFullYear();
    var date_pub_mmddyy = `${months[month]} ${date}, ${year}`;

    let post_wrapper = document.createElement('div');
    post_wrapper.setAttribute('class', "post_wrapper");

    let desc_div = document.createElement('div');
    desc_div.setAttribute('class', "post_desc");

    let post_title_div = document.createElement('div');
    post_title_div.setAttribute('class', "post_title");
    post_title_div.innerHTML += "<h1>Latest Post</h1><h2>" + post_title + "</h2>";
    desc_div.appendChild(post_title_div);

    let pub_date_view_post_div = document.createElement('div');
    pub_date_view_post_div.setAttribute('class', "pub_date_view_post");

    let pub_date = document.createElement('div');
    pub_date.setAttribute('class', "pub_date");
    pub_date.innerHTML += "<b>Published</b>: " + date_pub_mmddyy;
    pub_date_view_post_div.appendChild(pub_date);

    let view_post = document.createElement('div');
    view_post.setAttribute('class', "view_post");
    view_post.innerHTML += "<a href='" + post_url + "' target='_blank'>View Post</a>";
    pub_date_view_post_div.appendChild(view_post);

    desc_div.appendChild(pub_date_view_post_div);

    let img_div = document.createElement('div');
    img_div.setAttribute('class', "post_img");
    let img_href = document.createElement('a');
    img_href.setAttribute('href', post_url);
    img_href.setAttribute('target', "_blank");

    let img_element = document.createElement('img');
    img_element.setAttribute('src', image_url);
    img_element.setAttribute('id', "post_image");
    let map_thumb = document.createElement('div');
    map_thumb.setAttribute('id', 'map');

    img_href.appendChild(img_element);
    img_div.appendChild(img_href);
    post_wrapper.appendChild(desc_div);
    let img_map = document.createElement('div');
    img_map.setAttribute('id', 'img_map');
    img_map.appendChild(img_div);
    img_map.appendChild(map_thumb);
    post_wrapper.appendChild(img_map);
    blog_container.appendChild(post_wrapper);

    const post_location_lat = resp.latest_post.post_location.lat;
    const post_location_lng = resp.latest_post.post_location.lng;
    const post_location_name = resp.latest_post.post_location.name;
    const mba = resp.latest_post.mba;

    console.log(post_location_lng, post_location_lat);
    // setTimeout(function() {
    loadMap(post_location_lng,post_location_lat,post_location_name,mba);
    // }, 4000)
  })
  .catch(function (error) {
    // Silently fail - just don't show the blog section
    console.log('Blog API unavailable:', error.message);
    // Keep blog_section hidden by not removing the 'hidden' class
  });
}

getLatestPost();

// Handle stats iframe - show only on successful load with content
const statsIframe = document.getElementById('stats_module');
const statsContainer = document.getElementById('stats_container');

if (statsIframe && statsContainer) {
  // Hide container by default
  statsContainer.style.display = 'none';
  
  function checkAndShowIframe() {
    setTimeout(function() {
      try {
        // Try to check if iframe has content (will fail for cross-origin, but that's ok)
        const iframeDoc = statsIframe.contentDocument || statsIframe.contentWindow.document;
        if (iframeDoc && iframeDoc.body && iframeDoc.body.innerHTML.trim() !== '') {
          // Has content, show it
          statsContainer.style.display = 'block';
          console.log('Stats iframe loaded successfully');
        } else {
          console.log('Stats iframe empty - keeping hidden');
        }
      } catch (e) {
        // Cross-origin - can't access content, assume it's valid and show it
        statsContainer.style.display = 'block';
        console.log('Stats iframe loaded (cross-origin)');
      }
    }, 200);
  }
  
  // Check if iframe already loaded (script loads after iframe)
  if (statsIframe.contentWindow && statsIframe.contentWindow.document && statsIframe.contentWindow.document.readyState === 'complete') {
    console.log('Stats iframe already loaded, checking now');
    checkAndShowIframe();
  } else {
    // Iframe not loaded yet, attach listener
    console.log('Stats iframe not loaded yet, attaching listener');
    statsIframe.addEventListener('load', checkAndShowIframe);
  }
  
  // Keep hidden if iframe fails to load
  statsIframe.addEventListener('error', function() {
    console.log('Stats iframe failed to load');
  });
}
