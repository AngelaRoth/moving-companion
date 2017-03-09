
function loadData() {

  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');

  // clear out old data before new request
  $wikiElem.text("");
  $nytElem.text("");

// STREETVIEW CODE
  var street = $('#street').val();
  var city = $('#city').val();
  var address = street + ', ' + city;
  var imgTag = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '">';

  $greeting.text(address);
  $body.append(imgTag);

// NYT CODE
  var nytURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

  nytURL += '?' + $.param({
    'api-key': "3579d2c108694c7fb536928a79360c54",
    'q': address,
    'fl': "headline,snippet,web_url"
  });

  console.log(nytURL);
  // NOTE: If you want to see the JSON which the URL
  // returns, just paste the URL into the browser
  // address line.

  $.getJSON( nytURL )
    // ERROR-HANDLING: Make sure request succeeded using
    // .done() and .fail() on the object returned by .get()
    .done(function(data) {
      // 1st, log data to see how it's structured.
      // REMEMBER to expand by clicking on arrows!
      console.log(data);

      // 2nd, create a variable which ALREADY focusses on
      // the part of the data you're interested in.
      // (here, it is the array of 10 returned articles)
      var articles = data.response.docs;

      articles.forEach(function(art) {
        var headline = art.headline.main;
        var snippet = art.snippet;
        var artURL = art.web_url;
        var headString = '<a href="' + artURL + '">' + headline + '</a>';
        var snippetString = '<p>' + snippet + '</p>';
        var fullString = '<li class="article">' + headString + snippetString + '</li>';
        $nytElem.append(fullString);
      });
    })
    .fail(function() {
      $nytHeaderElem.text("NYT Articles Currently Unavailable");
    });


// WIKIPEDIA CODE
  var streetForURL = street.replace(' ', '%20').replace('.', '').replace(',', '');
  var cityForURL = city.replace(' ', '%20').replace('.', '').replace(',', '');
  // action=opensearch
  // search=[our string]
  // callback=wikiCallback
  var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityForURL + '&format=json&callback=wikiCallback';

  // Arguement is an OBJECT of key/value pairs (inside {})
  // url: wikiURL  [CAN also be a string before {}.  i.e. $.ajax(wikiURL, {})]
  // dataType: 'jsonp' (NOT json) (name is a STRING inside quotes)
  // success: function(response) {}
  $.ajax({
    url: wikiURL,
    dataType: 'jsonp',
    // NOTE: Some APIs want to use a different name for the callback function
    //       By default, using jsonp as the dataType will set the callback
    //       function name to callback (so following line is redundant).
    //       But if the "callback" in our URL was called something else,
    //       we would have to specify it here:
    // jsonp: "callback",
    headers: {'Api-User-Agent': 'MovingCompanion/1.0 (https://angelaroth.github.io/moving-companion/)'},
    success: function(data) {
      // NOTE: If we look in DevTools Network, and click on the
      // api.php?action..., in the Preview we we will see the callback
      // of this event. Notice that it as an ARRAY; the second item
      // is an array of articles; and the fourth is an array of URLs.
      var articles = data[1];
      var artLinks = data[3];
      var numArticles = articles.length;
      for (var i = 0; i < numArticles; i++) {
        var artString = '<a href="' + artLinks[i] + '">' + articles[i] + '</a>';
        var fullString = '<li class="article">' + artString + '</li>';
        $wikiElem.append(fullString);
      }
    }
  }).fail(function() {
    $wikiElem.append("Wikipedia Not Responding");
  });

  return false;
};

$('#form-container').submit(loadData);
