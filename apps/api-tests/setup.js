const envPath = require('path').resolve(process.cwd(), `env/${process.env.NODE_ENV || ''}.env`);
require('dotenv').config({ path: envPath });
