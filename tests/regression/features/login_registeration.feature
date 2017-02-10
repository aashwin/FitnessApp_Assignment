Feature: Login Front Screen
  As a user I want to be able to login and sign up

  Scenario: I can create an account and login with that account
    Given That I ensure that no test users exists in the database
    And That the application is loaded
    When I click on the link with partial text of "Signup"
    And I enter "test_valid_1" in the input box with name: username
    And I enter "password*1" in the input box with name: password
    And I enter "password*1" in the input box with name: confirmPassword
