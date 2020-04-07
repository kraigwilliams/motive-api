

module.exports={
PORT: process.env.PORT || 8000,
NODE_ENV: process.env.NODE_ENV || 'development',
DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder-mifflin@localhost/motive-api',
TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,  
JWT_SECRET: process.env.JWT_SECRET || 'motive-api-jwt-secret' ,
JWT_EXPIRY: process.env.JWT_EXPIRY || '3D'

}

//CLIENT_ORIGIN: