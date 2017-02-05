exports.server = {
    "port": process.env.SERVER_PORT || 8080
};
exports.application = {
    "namespace": "fitness.app.aashwin",
    "name": "Fitness App",
    "hashing": {"salt_work_factor": 10},
    "jwt_token_secret": "&Ce#!mjPM$zV^SCSR#!%uV!r"
};