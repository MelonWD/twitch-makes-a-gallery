# What is this

#### Twitch Internet Photo Gallery

We're currently working on an internet photo frame where users can submit images to have them displayed on a monitor to everyone in our office. All images displayed will be curated into a gallery.


## Who are we

We're Melon Digital, a team of highly skilled developers and designers based in Milton Keynes, UK.

In our downtime we think of fun projects and sometimes we make them, If we're streaming here, it's one of those times!

**You can find more about us  [on our website](https://www.melonwebdesign.co.uk/about/)**

**All of our projects can be viewed on [https://twitchmakes.com/](https://twitchmakes.com/)**


## Frontend

The frontend is built using react. The template was built with `npx create-react-app` and then TypeScript support was added after.


## Backend
The backend is built with `express`, `@google-cloud/vision` and `node-exiftools` to store the name the user attaches to their image. `node-exiftools` requires a download of [exiftool](https://en.wikipedia.org/wiki/ExifTool) on your system.

The `express` application will bind to either port 3000 or the provided environment port at `process.env.port`, it has cors based middleware which should approve all routes, and will require locking down if you intend on sharing this resource with a single origin.

Uploading a file will place it within the `dist/upload` directory, original within the `tmp` folder. Once the image has been scanned by Google Vision, it will either be deleted if found to be a NSFW image or moved to `published` to be displayed to the front end.

The queue system work by moving these files between folders, once an image has been the oldest image within `published` for over 20 seconds, it will rotate the images and place the current displayed in `archived` and a new file will take its place.


### Installation and Useage

Create `.env` file, which contains the following:

```
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credientials/file.json

```

Please check the [node-exiftool](https://github.com/Sobesednik/node-exiftool#readme) README for information about exiftools and the dependencies required there.

To install

`npm install`

To execute / start the application

`npm start`

This command will also invoke a `prestart` command which will compile the application from TypeScript to JavaScript.

You will need to provide an `.env` file which contains a `GOOGLE_APPLICATION_CREDENTIALS` key pointing to a JSON Google Cloud Service account file, allowing the application to interface with Google Vision.

