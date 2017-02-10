exports.server = {
    "port": process.env.SERVER_PORT || 8080
};
exports.application = {
    "auth_token_header": "X_AUTH_TOKEN",
    "host": "localhost"
};
exports.database = {
    'url': 'mongodb://localhost:27017/fitness'
};