var youTubeTemplate = (function () {`
  <style>
    button, label { font-family: 'Montserrat', 'Helvetica', sans-serif; }
  </style>
  <div class="row youtube-component">
    <h2 style="font-weight: 600; text-transform: uppercase; margin-bottom: 25px;">Request a Song!</h2>
    <div class="col-md-6">

      <!-- Search Form -->
      <form id="video-search" class="form-inline">
        <div class="form-group">
          <input style="min-width: 325px; color: #000;" type="text" class="form-control" name="query" placeholder="Search YouTube for Music..">
          <button type="submit" class="btn btn-default"><strong>Search</strong></button>
        </div>
      </form>
      <!-- /Search Form -->

      <!-- Search Results -->
      <div id="search-results">
        <div class="row" style="margin: 25px 0 10px 0;">
          <div class="col-lg-6">
            <button class="btn btn-success" id="choose-this-video" style="background-color: #3f7255"><strong>Add To Playlist</strong></button>
          </div>
          <div class="col-md-6">
            <button class="btn btn-danger" id="try-next-video" style="background-color: #96514e;"><strong>Next Result</strong></button>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12" style="padding: 20px;">
            <div id="search-player"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <p><strong>Currently Requested: </strong></p>
      <p id="featuring"></p>
      <div id="playlist-player"></div>
    </div>
  </div>
`});


window.YouTube = (function() {

  // Advance to the next video in search results
  function nextVideoButton() {
    $('#try-next-video').on('click', function() {
      searchPlayer.nextVideo();
    });
  }


  // Executes search for YouTube videos
  function searchButton() {
    $('#video-search').on('submit', function(evt) {
      evt.preventDefault();
      searchPlayer.cuePlaylist({
        listType: 'search',
        list: $('input[name=query]').val()
      });
      $('input[name=query]').blur();
    });
  };


  // Add current search result video to playlist
  function saveVideoButton() {
    $('#choose-this-video').on('click', function() {
      var url = searchPlayer.getVideoUrl();
      if (url === 'https://www.youtube.com/watch') {
        alert('You need to search for a song before you can add one!');
      } else {
        db.save({
          id: url.split('v=')[1],
          title: searchPlayer.getVideoData().title
        }, 
        function success(resp) {
          refreshPlaylistPlayer();
        }, 
        function err(resp) {
          console.error(resp);
        });
      }
    });
  };


  // Database (MyJSON) interface
  var db = {
    url: 'https://api.myjson.com/bins/b62z7',
    query: function(cb) {
      $.get(db.url, cb);
    },
    save: function(data, success, err) {
      $.get(db.url, function(resp) {
        console.log('save resp', resp);
        resp.videos.push(data);
        $.ajax({
          url: db.url,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(resp.videos.filter(v => v.id))
        }).done(success).fail(err);
      });
    }
  };


  var shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


  // Lists some tracks from the playlist at random 
  function compileSummaryText() {
    var text = '';
    db.query(function(videos) {
      shuffle(videos).slice(0,3).forEach(function(v, i) {
        var addText = v.title.includes('-') ? v.title.split('-')[1].trim() : v.title;
        addText = addText.includes('(') ? addText.split('(')[0].trim() : addText;
        text += addText+', ';
      });
      text += 'and more...';
      $('#featuring').html(text);
    });
  }


  // Refreshes the current playlist data
  function refreshPlaylistPlayer() {
    db.query(function(videos) {
      playlistPlayer.cuePlaylist({
        name: 'Blaire + Kenny Wedding',
        playlist: shuffle(videos.map(function(v) {return v.id;})).join(',')
      });

    });
  };

  // Handler required by YouTube iFrame API
  window.onYouTubeIframeAPIReady = function() {
    searchPlayer = new YT.Player('search-player', {
      width: '416', 
      height: '291'
    });
    playlistPlayer = new YT.Player('playlist-player', {
      width: '500',
      height: '350',
      events: {
        onReady: refreshPlaylistPlayer
      }
    });
  };

  var renderTemplate = function() {
    $('#youtube').append(youTubeTemplate);
  }

  var init = function() {
    compileSummaryText();
    saveVideoButton();
    searchButton();
    nextVideoButton();
  }

  return {
    init: init
  };

})();