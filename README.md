# laravel-cloudwatch-logs-lambda-trello
Use AWS CloudWatch Logs &amp; Lambda to post Laravel Log messages to Trello.

![All Log Levels](screenshot-all-log-levels.png)

![Exception Info](screenshot-exception.png)

# Setup
## Step 1 - Get Your Laravel Logs into CloudWatch
I've written [an article](https://medium.com/@james_fairhurst/using-aws-cloudwatch-for-laravel-logs-on-forge-27590ee4fe33) which goes through the process of getting your Laravel app logs into CloudWatch. It's *relatively* straight forward however like everything it depends on your experience. Hit me up if you're having trouble.

## Step 2 - Get Your Trello App Key & User Token
Get your [App Key](https://trello.com/app-key) and also click on the **Token** link to generate a User Token. Input these into the variables in the **index.js** file e.g.

```
trelloApiKey = 'xxx';
trelloToken  = 'xxx';
```

## Step 3 - Find Your Trello List ID
Grab the Trello Board ID from the URL when viewing it e.g. `https://trello.com/b/BOARD_ID/personal` and then plug in all the variables into the URL below to get all the List IDs in the Board.

```
https://api.trello.com/1/boards/BOARD_ID/lists?key=APP_KEY&token=TOKEN
```

You'll get a JSON response and you'll have to grab the List ID of the List you want to create Cards in.

```
[{"id":"LIST_ID","name":"To Do"...]
```

A bit long-winded but finally input the List ID into the variable in the **index.js** file e.g.

```
trelloListId = 'xxx';
```

## Step 4 - Create a Lambda Function
Create a new Lambda function in the AWS Console and select the **cloudwatch-logs-process-data** blueprint as a starting point, this will ask you to select a Log Group (your Laravel log) and an optional pattern. Name your function and copy & paste the code in **index.js** into the inline code editor (remember to update the **Trello** variables). I've created a more detailed walkthrough in [an article]().

# Summary
Although there are other ways to get notified of errors e.g. external services ([Bugsnag](https://bugsnag.com/)) or Laravel specific packages ([lern](https://github.com/tylercd100/lern)) depending on your circumstances this could be another option. I've been wanting to delve into & learn the AWS eco-system for some time now and I've been documenting my efforts on Medium to hopefully help others & future me when I come to do things again. I'm also a Nodejs noob so if things can be improved let me know!

# Todo
* Stop duplicate Cards from being created
* Option to exclude log levels e.g. debug & info so only proper errors are reported
* ~~Article to document the Trello & Lambda setup steps~~ [Using AWS CloudWatch & Lambda to create Trello Cards from Laravel Logs]()