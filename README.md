## Back-end Developer Test

### Devcenter Backend Developer Test I

The purpose of this test is not only to quickly gauge an applicant's abilities with writing codes, but also their approach to development.

Applicants may use whatever language they want to achieve the outcome.

## Task

Build a bot that extracts the following from people’s Twitter bio (on public/open accounts), into a Google spreadsheet:

* Twitter profile name
* Number of followers

Target accounts using either of these criteria:
* Based on hashtags used
* Based on number of followers; Between 1,000 - 50,000

The bot is suppose to maintain a session and continously listen to the predefined hashtag

## Development Language

* Javascript (Node v8.9.1)

## Getting Started

* git clone https://github.com/neddinn/backend-test-I.git
* run `npm install`
* Setup necessary app config by
 - Adding a .env file in the project directory with the necessary config file (checkout .env.example)
 - Adding it straight-away in your project environment

The following process shows how to get the necessary config files

### Twitter Account Setup

1. Create a twitter account
2. Navigate to apps.twitter.com and click on 'Create New App' button.
3. Fill out the necessary details and click 'Create your Twitter Application' button.
4. Replace the consumer key, consumer secret, access token and access token secret values with the ones you generate.


### Google Spreadsheet
1. Go to the Google API Console
2. Create a new project
3. Click Enable API. Search for and enable the Google Drive API.
4. Create credentials for a service account to access Application data.
5. Obtain OAuth2 credentials from Google Developers Console for google spreadsheet api and drive api
6. Copy the client_email and private_key into your environment variable following the naming order indicated in the .env.example file
7. Copy the spreadsheet key and add to the environment. Spreadsheet key is the long id in the sheets URL


## Other Information
* Run application
```node index.js```
