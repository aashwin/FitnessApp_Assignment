const config = require('../config');
module.exports = function () {
    this.Given(/^That the application is loaded$/, function () {
        var url = "http://" + config.application.host + ":" + config.server.port + "/";
        return helpers.loadPage(url, 100).then(function () {
            return driver.wait(until.urlIs(url), 50000);
        });
    });
    this.When(/^I click on the link with (partial text|text) of "([^"]*)"$/, function (partial, linkText) {
        var byText;
        if (partial === 'text') {
            byText = by.linkText(linkText);
        } else {
            byText = by.partialLinkText(linkText);
        }
        return driver.findElement(byText).click();
    });
    this.When(/^I enter "([^"]*)" in the input box with name: (.+)$/, function (text, name) {
        driver.wait(function () {
            return driver.findElement(by.name(name)).isDisplayed();
        }, 15000);
        driver.wait(function () {
            return false;
        }, 10000000);
        return driver.findElement(by.name(name)).sendKeys(text);

    });
};