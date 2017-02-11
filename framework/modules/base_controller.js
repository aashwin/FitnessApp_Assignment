var debug = require('debug')("appframework:basecontroller");
module.exports = function (config) {
    if (!config) {
        config = {default_limit_per_page: 10, max_limit_per_page: 100};
    }
    return function (req, res, next) {
        req.request_info = {
            limit: config.default_limit_per_page, page: 1, offset: 0, sort_field: null, sort_by: null
        };
        if (req.query) {
            if (req.query.limit) {
                if (parseInt(req.query.limit) > 0) {
                    req.request_info.limit = parseInt(req.query.limit) || config.default_limit_per_page;
                }
                delete req.query.limit;
            }
            if (req.request_info.limit > config.max_limit_per_page) {
                req.request.info.limit = config.max_limit_per_page;
            }
            if (req.query.page) {
                if (parseInt(req.query.page) > 0) {
                    req.request_info.page = parseInt(req.query.page) || 1;
                    req.request_info.offset = req.request_info.page * req.request_info.limit - req.request_info.limit;
                }
                delete req.query.page;
            }
            req.request_info.sort_field = req.query.sort_field || null;
            if (req.request_info.sort_field) {
                req.request_info.sort_by = (req.query.sort_by || "asc").toLowerCase();
                if (req.request_info.sort_by !== "asc" && req.request_info.sort_by !== "desc") {
                    req.request_info.sort_by = "asc";
                }
            }
            delete req.query.sort_field;
            delete req.query.sort_by;

        }
        debug("%s %s by %s", req.method, req.originalUrl, req.ip);
        next();
    }
};