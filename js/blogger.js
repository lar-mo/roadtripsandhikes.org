const cachebuster = Math.floor(Date.now() / 1000);
const bloggerv3_url = 'https://api.roadtripsandhikes.org/wrapper/bloggerApiGetLatestPost/?'+cachebuster;
  function getLatestPost() {
    axios.get(bloggerv3_url)
    .then(function (response) {
      let resp = response.data;
      // console.log(resp);
      let image_url = resp.latest_post.image_url;
      let post_title = resp.latest_post.title;
      let post_published = JSON.stringify(resp.latest_post.published).slice(1,11);
      let post_url = resp.latest_post.post_url;
      var date_pub = new Date(post_published);
      var month = date_pub.getMonth();
      var months = {
        0: "January",
        1: "Februrary",
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

      let pub_date_read_more_div = document.createElement('div');
      pub_date_read_more_div.setAttribute('class', "pub_date_read_more");

      let pub_date = document.createElement('div');
      pub_date.setAttribute('class', "pub_date");
      pub_date.innerHTML += "<b>Published</b>: " + date_pub_mmddyy;
      pub_date_read_more_div.appendChild(pub_date);

      let read_more = document.createElement('div');
      read_more.setAttribute('class', "read_more");
      read_more.innerHTML += "<a href='" + post_url + "' target='_blank'>Read More</a>";
      pub_date_read_more_div.appendChild(read_more);

      desc_div.appendChild(pub_date_read_more_div);

      let img_div = document.createElement('div');
      img_div.setAttribute('class', "post_img");
      let img_href = document.createElement('a');
      img_href.setAttribute('href', post_url);
      img_href.setAttribute('target', "_blank");

      let img_element = document.createElement('img');
      img_element.setAttribute('src', image_url);
      img_element.setAttribute('id', "post_image");

      img_href.appendChild(img_element);
      img_div.appendChild(img_href);
      post_wrapper.appendChild(desc_div);
      post_wrapper.appendChild(img_div);
      blog_container.appendChild(post_wrapper);
    });
  }
