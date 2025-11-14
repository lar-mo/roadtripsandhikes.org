      // Code refactor by Claude.ai
      // Configuration object - easy to maintain and extend

      const buttons = {
        1: document.querySelector('#bg_switcher_button1 img'),
        2: document.querySelector('#bg_switcher_button2 img'),
        3: document.querySelector('#bg_switcher_button3 img'),
        4: document.querySelector('#bg_switcher_button4 img')
      };

      const backgrounds = {
        1: {
          title: "Columbia River Gorge<br>Beacon Rock State Park, Washington",
          desktop: "beacon-rock.jpg",
          mobile: "beacon-rock.jpg"
        },
        2: [
          {
            title: "Fort Rock State Natural Area<br>Lake County, Oregon",
            desktop: "fort-rock.jpg",
            mobile: "fort-rock.jpg"
          },
          {
            title: "Pinnacle Peak from Plummer Peak<br>Mount Rainier National Park, Washington",
            desktop: "pinnacle-peak.jpg",
            mobile: "pinnacle-peak.jpg"
          },
          {
            title: "Phlox Point & Hardy Ridge<br>Beacon Rock State Park, Washington",
            desktop: "phlox-point-brsp.jpg",
            mobile: "phlox-point-brsp.jpg"
          }
        ],
        3: [
          {
            title: "Mount St. Helens / Loowit / Lawetlat'la<br>Gifford Pinchot National Forest",
            desktop: "msh-ne-side.jpg",
            mobile: "msh-ne-side.jpg"
          },
          {
            title: "No Name Lake and Bend Glacier<br>Three Sisters Wilderness, Central Oregon",
            desktop: "no-name-lake-bg.jpg",
            mobile: "no-name-lake-bg.jpg"
          },
          {
            title: "Mount St. Helens from Coldwater Peak<br>Gifford Pinchot National Forest",
            desktop: "msh-coldwater-peak.jpg",
            mobile: "msh-coldwater-peak.jpg"
          }
        ],
        4: [
          {
            title: "Mount St. Helens Summit / Loowit / Lawetlat'la<br>Gifford Pinchot National Forest",
            desktop: "msh-summit-bg.jpg",
            mobile: "msh-summit-bg.jpg"
          },
          {
            title: "Cascade Head Marine Reserve<br>Lincoln City, Oregon",
            desktop: "lincoln-city.jpg",
            mobile: "lincoln-city.jpg"
          },
          {
            title: "Mount St. Helens from Butte Camp<br>Gifford Pinchot National Forest",
            desktop: "butte-camp.jpg",
            mobile:  "butte-camp.jpg"
          }
        ]
      };

      const BASE_URL = "https://www.roadtripsandhikes.org/images/";
      const ACTIVE_IMG = "https://www.roadtripsandhikes.org/images/active.png";
      const INACTIVE_IMG = "https://www.roadtripsandhikes.org/images/inactive.png";

      // OPTION 3: Cross-fade with overlay (V2) - smoother, no flash
      function changeBackgroundImageCrossfade(bgId) {
        let bgConfig = backgrounds[bgId];
        if (Array.isArray(bgConfig)) {
          bgConfig = bgConfig[Math.floor(Math.random() * bgConfig.length)];
        }

        if (!bgConfig) return;

        // Update title immediately
        document.getElementById('hero_title_card').innerHTML = bgConfig.title;

        // const isMobile = window.matchMedia('(max-width: 414px)').matches;
        // const imageFile = isMobile ? bgConfig.mobile : bgConfig.desktop;
        const newImageUrl = `url(${BASE_URL}${bgConfig.desktop})`;

        // Create a temporary overlay div for the new image
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';  // Add
        overlay.style.bottom = '0';  // Add
        overlay.style.backgroundImage = newImageUrl;
        overlay.style.backgroundSize = 'cover';
        overlay.style.backgroundPosition = 'center';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.6s ease-in-out';
        overlay.style.zIndex = '1';

        backgroundFixed.style.position = 'fixed';
        backgroundFixed.appendChild(overlay);

        // Trigger fade-in
        setTimeout(() => {
          overlay.style.opacity = '1';
        }, 10);

        // After fade completes, swap images and remove overlay
        setTimeout(() => {
          backgroundFixed.style.backgroundImage = newImageUrl;
          backgroundFixed.removeChild(overlay);
        }, 650);

        // Update buttons
        Object.entries(buttons).forEach(([id, img]) => {
          // img.src = Number(id) === bgId ? ACTIVE_IMG : INACTIVE_IMG;
          const newSrc = Number(id) === bgId ? ACTIVE_IMG : INACTIVE_IMG;
          img.src = newSrc;
        });
      }
