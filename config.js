exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       process.env.NODE_ENV === 'production' ?
                            'mongodb://caulds989:Seoul989@ds031975.mlab.com:31975/mongo-shopping-list-aulds' :
                            'mongodb://localhost/shopping-list-dev';
exports.PORT = process.env.PORT || 8080;
