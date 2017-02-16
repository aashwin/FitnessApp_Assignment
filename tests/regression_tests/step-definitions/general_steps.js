var config = require("../test.config.json");
module.exports = function () {

    this.Given(/^The application is loaded$/, function () {
        return helpers.loadPage(config.url).then(function () {
            return driver.wait(until.titleIs("Fitness Tracker"), 500000).then(function () {
                return driver.wait(until.elementLocated(by.css('body')), 10000);
            });
        });
    });

    this.When(/^I enter "([^"]*)" in the "([^"]*)" text field$/, function (text, name) {
        return driver.wait(until.elementLocated(by.name(name)), 10000).then(function (elm) {
            return driver.sleep(1000).then(function () {
                return elm.sendKeys(text);
            });
        });
    });

    this.Then(/^I click on the link that contains text "([^"]*)"$/, function (text) {
        return driver.wait(until.elementLocated(by.partialLinkText(text)), 10000).then(function (elm) {
            return elm.click().then(function () {
                return driver.sleep(2000);
            });
        });
    });
    this.Then(/^I click on the button that has a value of "([^"]*)"$/, function (value) {
        return driver.wait(until.elementLocated(by.xpath("//input[@value='" + value + "']")), 10000).then(function (elm) {
            return elm.click();
        });
    });
    this.Then(/^The success notification says "([^"]*)"$/, function (value) {
        return driver.wait(until.elementLocated(by.css(".ui-notification.success .message")), 10000).then(function (elm) {
            return driver.sleep(600).then(function () {
                return elm.getText().then(function (text) {
                    return expect(text).to.equal(value);
                });
            });
        });
    });
    this.Then(/^the application page is loaded$/, function () {
        return driver.wait(until.elementLocated(by.css('body')), 10000);
    });

};