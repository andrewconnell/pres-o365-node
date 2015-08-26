var HomeController = (function () {
    function HomeController(app) {
        this.app = app;
        this.loadRoutes();
    }

    /**
     * Setup routing for controller.
     */
    HomeController.prototype.loadRoutes = function () {
        // setup home route for application
        this.app.get('/', function (request, response) {
            response.render('home/index', {someProperty: 'hi node.js!'});
        });
    };
    return HomeController;
})();

module.exports = HomeController;