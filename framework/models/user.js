var User = function (data) {
    if (data) {
        this.data = data;
    }
};

User.prototype.data = null;

User.prototype.get = function (name, safe) {
    safe = safe || false;
    if (name) {
        if (safe && name == 'password') {
            return "********";
        }
        return this.data[name];
    }
    var returnData = this.data;
    if (safe) {
        returnData["password"] = "*********";
    }
    return returnData;
};

User.prototype.set = function (name, value) {
    if (this.data === null) {
        this.data = {};
    }
    this.data[name] = value;
};

module.exports = User;