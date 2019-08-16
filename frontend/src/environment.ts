const environments: any =  {
    development: {
        api_url: 'http://nathan.melon:3000', 
    },
    production: {
        api_url: 'TODO: fill this'
    }
}

// Retrieve the current environment.
const env = process.env.ENV || 'development';

// Export specifically that environment.
export default environments[env];
