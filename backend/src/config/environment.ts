const environments =  {
    development: {
        url: '//nathan.melon:3000', 
        port: 3000,
        UPLOAD_ROOT: "uploads",
        PUBLISHED_FOLDER_NAME: "publish",
        ARCHIVED_FOLDER_NAME: "archive",
        TEMPORARY_FOLDER_NAME: "tmp"
    },
    production: {
        url: '//api.twitchmakes.com',
        port: 80,
        UPLOAD_ROOT: "uploads",
        PUBLISHED_FOLDER_NAME: "publish",
        ARCHIVED_FOLDER_NAME: "archive",
        TEMPORARY_FOLDER_NAME: "tmp"
    }
}


// Retrieve the current environment.
const env = process.env.ENV || 'development';

// Export specifically that environment.
export default environments[env];
