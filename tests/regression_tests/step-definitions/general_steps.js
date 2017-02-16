var config = require("../test.config.json");
var data = require("../modules/data");
module.exports = function () {

    this.Given(/^The application is loaded$/, function (done) {
        driver.wait(until.elementLocated(by.css('body')), 500000).then(function () {
            helpers.loadPage(config.url).then(function () {
                driver.wait(until.titleIs("Fitness Tracker"), 500000).then(function () {
                    driver.wait(until.elementLocated(by.css('body')), 500000).then(function () {
                        "use strict";
                        done();
                    });
                });
            });
        });
    });
    this.Given(/^I reload application$/, function (done) {
        driver.wait(until.elementLocated(by.css('body')), 500000).then(function () {
            helpers.loadPage(config.url).then(function () {
                driver.wait(until.titleIs("Dashboard"), 500000).then(function () {
                    driver.wait(until.elementLocated(by.css('body')), 500000).then(function () {
                        "use strict";
                        done();
                    });
                });
            });
        });
    });

    this.When(/^I enter "([^"]*)" in the "([^"]*)" text field$/, function (text, name) {
        text = data.convertVariables(text);
        return driver.wait(until.elementLocated(by.name(name)), 10000).then(function (elm) {
            return driver.sleep(1000).then(function () {
                return elm.sendKeys(text);
            });
        });
    });
    this.When(/^I enter "([^"]*)" in the text field with the ID "([^"]*)"$/, function (text, id) {
        text = data.convertVariables(text);
        return driver.wait(until.elementLocated(by.id(id)), 10000).then(function (elm) {
            return driver.sleep(1000).then(function () {
                return elm.clear().then(function () {
                    return elm.sendKeys(text);
                });
            });
        });
    });
    this.When(/^I tick the (radio|checkbox) with name "([^"]*)" and value "([^"]*)"$/, function (type, name, value) {
        return driver.wait(until.elementLocated(by.xpath("//input[@type='" + type + "'][@name='" + name + "'][@value='" + value + "']")), 10000).then(function (elm) {
            return driver.sleep(1000).then(function () {
                return elm.click();
            });
        });
    });
    this.When(/^I select "([^"]*)" in the "([^"]*)" dropdown$/, function (value, name) {
        return driver.wait(until.elementLocated(by.xpath("//input[@type='" + type + "'][@name='" + name + "'][@value='" + value + "']")), 10000).then(function (elm) {
            return driver.sleep(1000).then(function () {
                return elm.click();
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
        return driver.sleep(1000).then(function () {
            return driver.wait(until.elementLocated(by.css(".ui-notification.success .message")), 10000).then(function (elm) {
                return driver.sleep(600).then(function () {
                    return elm.getText().then(function (text) {
                        return expect(text).to.equal(value);
                    });
                });
            });
        });
    });
    this.Then(/^the application page is loaded$/, function () {
        return driver.wait(until.elementLocated(by.css('body')), 10000);
    });

    this.Then(/^The "([^"]*)" dashcard has the (text|value) of "([^"]*)"$/, function (title, type, value) {
        if (type == 'text') {
            return driver.wait(until.elementLocated(by.xpath('//dash-card[@title="' + title + '"]//div[contains(@class, "value")]')), 10000).then(function (elm) {
                return elm.getText().then(function (text) {
                    return expect(text.toLowerCase()).to.equal(value.toLowerCase());
                });
            });
        } else {
            return driver.wait(until.elementLocated(by.xpath("//dash-card[@title='" + title + "']")), 10000).then(function (elm) {
                return elm.getAttribute("value").then(function (text) {
                    return expect(text.toLowerCase()).to.equal(value.toLowerCase());
                });
            });
        }
    });
    this.Then(/^The page heading says "([^"]*)"$/, function (heading) {
        return driver.sleep(1000).then(function () {
            return driver.wait(until.elementLocated(by.tagName("h1")), 10000).then(function (elm) {
                return elm.getText().then(function (text) {
                    return expect(text.toLowerCase()).to.equal(heading.toLowerCase());
                });
            });
        });
    });
    this.Then(/^I verify that there is a comment "([^"]*)"$/, function (value) {
        return driver.sleep(1500).then(function () {
            return driver.wait(until.elementLocated(by.xpath('//div[contains(@class, "comment")]//p')), 10000).then(function (elm) {
                return elm.getText().then(function (text) {
                    return expect(text.toLowerCase()).to.equal(value.toLowerCase());
                });
            });
        });
    });
    this.Then(/^I verify the text field with ID "([^"]*)" contains "([^"]*)"$/, function (id, value) {
        return driver.sleep(2000).then(function () {
            return driver.wait(until.elementLocated(by.id(id)), 10000).then(function (elm) {
                return driver.sleep(1000).then(function () {
                    return driver.executeScript('return document.getElementById("' + id + '").value;').then(function (text) {
                        return expect(text.toLowerCase()).to.equal(value.toLowerCase());
                    });
                });
            });
        });
    });
    this.When(/^I verify that there is atleast (\d+) search result$/, function (num) {
        return driver.sleep(2000).then(function () {
            return driver.findElements(by.className('home_card')).then(function (elms) {
                return expect(elms.length).to.have.above(num - 1);

            });
        });
    });

};