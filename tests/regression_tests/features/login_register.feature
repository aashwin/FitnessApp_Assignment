Feature:
  Login and Registeration

  Scenario: As a user, I register an user through the application
    Given  The application is loaded
    And That I ensure that no test users exists in the database
    When I click on the link that contains text "Signup"
    And I enter "user_test_123" in the "username" text field
    And I enter "password*123" in the "password" text field
    And I enter "password*123" in the "confirmPassword" text field
    And I click on the button that has a value of "Signup"
    Then The success notification says "Successfully Registered"
    And I verify that user with username "user_test_123" exists in the database


  Scenario: As a user, I can login to the application
    Given  The application is loaded
    And That I ensure that no test users exists in the database
    When I click on the link that contains text "Signup"
    And I enter "user_test_123" in the "username" text field
    And I enter "password*123" in the "password" text field
    And I enter "password*123" in the "confirmPassword" text field
    And I click on the button that has a value of "Signup"
    Then The success notification says "Successfully Registered"
    And I verify that user with username "user_test_123" exists in the database
    When I enter "user_test_123" in the "username" text field
    And I enter "password*123" in the "password" text field
    And I click on the button that has a value of "Login"
    Then the application page is loaded
