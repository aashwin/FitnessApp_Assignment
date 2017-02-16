Feature:
  Profile

  Scenario: As a user, I try to edit my profile
    Given  The application is loaded
    When I enter "{{TEST_USERNAME}}" in the "username" text field
    And I enter "{{TEST_PASSWORD}}" in the "password" text field
    And I click on the button that has a value of "Login"
    Then the application page is loaded
    When I click on the link that contains text "Hey "
    And I enter "Bruce Wayne" in the text field with the ID "name"
    And I enter "bruce@gotham.com" in the text field with the ID "email"
    And I enter "76.2" in the text field with the ID "weightInKg"
    And I click on the button that has a value of "Update Profile >>"
    Then The success notification says "Successfully updated your profile"
    When The application is loaded
    And I click on the link that contains text "Hey Bruce"
    Then I verify the text field with ID "name" contains "Bruce Wayne"
    And I verify the text field with ID "email" contains "bruce@gotham.com"
    And I verify the text field with ID "weightInKg" contains "76.2"
    And I enter "" in the text field with the ID "name"
    And I enter "" in the text field with the ID "email"
    And I enter "" in the text field with the ID "weightInKg"
    And I click on the button that has a value of "Update Profile >>"
    Then The success notification says "Successfully updated your profile"


