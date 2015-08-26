var HomeController = require('./homeController');

// define controller object
var Controllers = (function () {
    function Controllers(app) {
        this.app = app;
    }
    Controllers.prototype.init = function () {
        var home = new HomeController(this.app);
    };
    return Controllers;
})();

// export controller
module.exports = Controllers;