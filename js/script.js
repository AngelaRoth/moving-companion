
function loadData() {

  var $body = $('body');
  var $wikiElem = $('#wikipedia-links');
  var $nytHeaderElem = $('#nytimes-header');
  var $nytElem = $('#nytimes-articles');
  var $greeting = $('#greeting');

  // clear out old data before new request
  $wikiElem.text("");
  $nytElem.text("");

  var street = $('#street').val();
  var city = $('#city').val();
  var address = street + ', ' + city;
  var imgTag = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '">';

  $greeting.text(address);
  $body.append(imgTag);

  var nytURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

  nytURL += '?' + $.param({
    'api-key': "3579d2c108694c7fb536928a79360c54",
    'q': address,
    'fl': "headline,snippet,web_url"
  });

  console.log(nytURL);

  $.getJSON( nytURL, function( data ) {
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
      var fullString = '<li>' + headString + snippetString + '</li>';
      $nytElem.append(fullString);
    });

  });



/*
  $.getJSON( nytURL, function( data ) {
    $.each( data, function( key, val ) {
      if (key === "docs") {
        key.forEach(function(val) {
          var headline = val.headline.main;
          var lead = val.lead_paragraph;
          var headlineString = "<h2>" + headline + "</h2>";
          var leadString = "<p>" + lead + "</p>";
          $nytElem.append(headlineString);
          $nytElem.append(leadString);
        });
      }
    });
  });

*/  return false;
};

$('#form-container').submit(loadData);
