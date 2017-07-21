'use strict';

// ------------
// state object
// ------------

const state = {
  tags: []
};

function genreSelector() {
  $('#js-genre-selector').select2({
    ajax: {
      url: '/genres',
      dataType: 'json',
      delay: 250,
      data: function(params) {
        return {
          q: params.term, 
        };
      },
      processResults: function (data) {
        const namesArr = data.map(function(object) {
          return { id: object._id, text: object.name };
        });
        return {
          results: namesArr
        };
      },
      cache: true
    },
    minimumInputLength: 1
  });

  $('#js-genre-selector').on('select2:select', function(event) {
    const selection = event.params.data.text;
    const id = $('#js-album-id').val();

    $.ajax({
      url: `/albums/${id}/tags`,
      dataType: 'json',
      method: 'PUT',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        tag: selection
      }),
      success: function(data) {
        $('#js-album-search-button').trigger('click');
      }
    });
  });
}

function albumSearcher() {
  $( '#js-album-searcher' ).autocomplete({
    source: function( request, response ) {
      let result;
      $.ajax({
        url: 'https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&api_key=9cb98547379ad2c1b5b680646cbdac53&format=json',
        dataType: 'json',
        data: {
          artist: request.term
        },
        success: function( data ) {
          result = data.topalbums.album.map(function(object) {
            return `${object.artist.name} | ${object.name}`;
          });
          response(result);
        }
      });
    },
    minLength: 1
  });
}

// artist: LED | album: Wściekłość i wrzask
function installSearchButtonListener() {
  $('#js-album-search-button').click(function(event) {
    const [ artist, name ] = $('#js-album-searcher').val().split('|');

    $.ajax({
      url: '/albums',
      dataType: 'json',
      data: {
        artist: artist.trim(),
        name: name.trim()
      },
      success: function(data) {
        data = data[0] || data;
        // $('#js-album-header').html(data.artist + ' ' + data.name);
        // $('#js-album-tags').html(data.tags);
        // $('#js-album-rating').html(data.ratings);
        // $('#js-album-comments').html(data.comments);

        
        $('#js-tags-view').html(`tags: ${renderTagsView(data)}`);
        $('#js-comments-view').html(renderCommentsView(data));
        $('#js-album-id').val(data._id);
      }
    });
    // unpack album attributes into display
  });
}

// db.albums.find( { artist: 'Lorde' } )

function renderAlbumHtml(data) {
  const headerHtml = `Artist: ${data.artist}, Album: ${data.name}`;
  const tagsHtml = createTagsView(data);
  const commentsHtml = data.comments.length > 0 ? `comments: ${data.comments[0].username} ${data.comments[0].content}`: 'Comments: ';
  return `${headerHtml} <br>
          ${tagsHtml} <br>
          ${commentsHtml} <br>`;
}

function renderTagsView(data) {
  // data.tags is an array of strings where each tag is a string
  console.log(data.tags)
  const tags = data.tags.map(function(tag) {
    return `<li>${tag}</li>`;
  });

  return tags;
}

function renderCommentsView(data) {
  // data.comments is an array of objects whose properties are username, content
  console.log(data.comments)
  const comments = data.comments.map(function(comment) {
    return `<li>
      <div>${comment.username} says:</div>
      <div>${comment.content}</div>
      </li>`;
  });

  return comments;
}



$(function() {
  installSearchButtonListener();
  genreSelector();
  albumSearcher();
});

// Application name	academic
// API key	9cb98547379ad2c1b5b680646cbdac53
// Shared secret	8d5ad4d7da3487a8bf07b5b312ecf66c
// Registered to	krp312