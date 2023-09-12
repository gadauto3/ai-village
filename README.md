# AI-Village
Open-source prototype of an AI game build on AWS Lambda and using React

# Vision
With GenAI permeating the products and services we use on a daily basis, it may become increasingly important to be able to distinguish AI-generated content from human-generated/curated content. How might you hone your skills? This project is one gamified answer.

# Instructions
To start your game, click on "Add Conversation" to add more conversations; more chats means more points! Then click "Begin." As you read the villagers' chats, try to find the parts that the AI is making up. If you think it's happening, click the "I'm noticing AI generation" button. But be careful, you can only guess once per chat! An exactly right answer gives you 15 points. If you want to try again, just refresh the page to start over. Happy playing!

# Architecture
![alt text](ai_village_architecture.png "Site Architecture")

1. User goes to the link provided to play the game.
2. The front-end is a static website served from an S3 bucket. A few game assets (json configuration) exist in the bucket as well.
3. Backend calls are made to API gateway which routes to a Lambda.
4. The Lambda is written in Node. The Lambda gets some assets from S3 and the OpenAI key from Parameter Store.
5. The OpenAI API calls drive the main game mechanic.

Important note: the whole site is IaC, written in terraform. Deployment and teardown happen with single commands.

# Information
For information about developing and deploying the application, [start here](application/README.md).
  
# Gratitude

Thanks to https://github.com/kurianoff for creating the forked project, quickly fixing a bug, and pointing me in the right direction.
Thanks to ChatGPT for helpful responses.
