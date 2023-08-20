# ai-village
 Open-source prototype of an AI game build on AWS Lambda and using React

# Information
This is based on the project here:
https://github.com/terraformita/terraform-aws-serverless-app/tree/main/examples/simple

  If you're going to use it, start here:
  https://medium.com/@kurianoff/deploy-serverless-react-app-with-node-js-express-backend-to-aws-with-terraform-in-under-15-minutes-2386bf0c58e9


# Gratitude

Thanks to https://github.com/kurianoff for creating the forked project, quickly fixing a bug, and pointing me in the right direction.
Thanks to ChatGPT for helpful responses.

# COMMIT MSG: https://chat.openai.com/c/069296d5-1db4-4006-9130-2772611c1873
# Prompt: 
I want you to use the following code (from above) as a template for a new application. The main class is called Village. A Village is made up of Conversations. Conversations take place between 1 to 5 Persons, though generally it will be 2 Persons. A person has a name, an icon string, and a currentLine string (in React code, the Person row.) The currentLine is populated by the conversation. 
In terms of the add row button, it will be renamed to add conversation. Pressing this button will call the API to retrieve the indicated number of conversations. For both success and error responses, a JavaScript alert should pop up. The API will return a Village object with an array of Conversation objects. Conversations will contain an array of lines. The lines will be made up of a name, a text string, and a sentiment string.
The Conversation will have an array of Persons, created from the data in the array of lines. The conversation will keep track of the current line, which is spoken by the indicated Person.
Please comment each function and section of code. 