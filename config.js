exports.server = {
    "port": process.env.SERVER_PORT || 8080
};
exports.application = {
    "namespace": "fitness.app.aashwin",
    "name": "Fitness App",
    "hashing": {"salt_work_factor": 10},
    "jwt_token_secret": "&Ce#!mjPM$zV^SCSR#!%uV!r",
    "unauthorised_return_url": "/",
    "auth_token_header": "X_AUTH_TOKEN",
    "data_handling": {
        "max_limit_per_page": 1000,
        "default_limit_per_page": 5
    }
};
exports.authentication = {
    "token_field": "X_AUTH_TOKEN",
    "jwt_token_secret": "&Ce#!mjPM$zV^SCSR#!%uV!r",
    "whitelist": ['/', '/index', '/app.*', '/api/authenticate', {path: '/api/users', method: 'POST'}]
};
exports.database = {
    'url': 'mongodb://localhost:27017/fitness'
};