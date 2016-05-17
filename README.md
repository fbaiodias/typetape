typetape
===

Where you can create Spotify playlists connected to Typeforms where anyone can add tracks.
Made using [Typeform Webhooks](https://www.typeform.com/help/webhooks/) and [Redirect after Submit](https://www.typeform.com/help/redirect-after-submitting/).

## setup

 - Install Postgres and create a database called `typetape`. *If you're on OSX, I recommend using [Postgres.app](http://postgresapp.com/) and [Postico](https://eggerapps.at/postico/).*

- Install dependencies:
```sh
npm i
```

## development

```sh
npm run dev

# gives you a localtunnel.me url which you can add to the typeform
npm run tunnel
```
