require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index.hbs')
})


app.get('/artist-search', (req, res) => {
    let artist = req.query.input

    spotifyApi.searchArtists(artist)
    .then(data => {
        res.render('artist-search-results.hbs', {data: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
    })


app.get('/albums/:id', (req, res) => {
    let id = req.params.id

    spotifyApi.getArtistAlbums(id)
    .then((data) => {
        res.render('albums.hbs', {data: data.body.items})
    })
    .catch((err) => {
          console.error(err);
        }
      );
})

app.get('/tracks/:id', (req, res) => {
    let id = req.params.id

    spotifyApi.getAlbumTracks(id, { limit : 10, offset : 1 })
    .then((data) => {
        res.render('tracks.hbs', {data: data.body.items})
    })
     .catch((err) => {
        console.log('Something went wrong!', err);
  });
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
