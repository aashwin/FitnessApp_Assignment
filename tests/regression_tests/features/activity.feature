Feature:
  Activities

  Scenario: As a user, I can login to the application and create an activity using manual entry mode
    Given  The application is loaded
    When I enter "{{TEST_USERNAME}}" in the "username" text field
    And I enter "{{TEST_PASSWORD}}" in the "password" text field
    And I click on the button that has a value of "Login"
    Then the application page is loaded
    When I click on the link that contains text "Create Activity"
    And I click on the link that contains text "Manual Entry"
    And I enter "Evening Run" in the text field with the ID "name"
    And I tick the radio with name "visibility" and value "2"
    And I enter "19" in the text field with the ID "distance"
    And I enter "133" in the text field with the ID "elevationInMeters"
    And I enter "1" in the text field with the ID "durationH"
    And I enter "11" in the text field with the ID "durationM"
    And I enter "34" in the text field with the ID "durationS"
    And I enter "This was a great run with @Friend" in the text field with the ID "notes"
    And I click on the button that has a value of "Add Activity >>"
    Then The success notification says "Successfully created activity"
    And The page heading says "Evening Run"
    And The "Distance" dashcard has the value of "30.58"
    And The "Elevation" dashcard has the value of "133"
    And The "Duration" dashcard has the text of "01:11:34"
    And I delete all activities of this user via the REST API

  Scenario: As a user, I can login to the application and create an activity and add a comment
    Given The application is loaded
    When I enter "{{TEST_USERNAME}}" in the "username" text field
    And I enter "{{TEST_PASSWORD}}" in the "password" text field
    And I click on the button that has a value of "Login"
    Then the application page is loaded
    When I click on the link that contains text "Create Activity"
    And I click on the link that contains text "Manual Entry"
    And I enter "Evening Run" in the text field with the ID "name"
    And I click on the button that has a value of "Add Activity >>"
    Then The success notification says "Successfully created activity"
    And The page heading says "Evening Run"
    When I enter "This is a good run mate, keep it going!" in the text field with the ID "comment"
    Then I verify that there is a comment "This is a good run mate, keep it going!"
    And I delete all activities of this user via the REST API