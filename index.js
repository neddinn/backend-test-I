require('dotenv').config()
const Twitter           = require('twitter'),
      inquirer          = require('inquirer');
      GoogleSpreadsheet = require('google-spreadsheet'),
      async             = require('async');

const twiiterCred = {
  consumer_key:         process.env.TWITTER_CONSUMER_KEY,
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
  access_token_key:     process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
};

const sheetsCred = {
  client_email: process.env.GOOGLESHEET_CLIENT_EMAIL,
  private_key:  process.env.GOOGLESHEET_PRIVATE_KEY.replace(/\\n/g, '\n')
};

let sheet,
    twitterClient,
    doc,
    messagePrompt,
    seperator,
    sheetHeaders,
    sheetTitle,
    worksheetId;

// initialise google sheet and initial config
const initSheet = async (sheetTitle, headers) => {
  return async.series([
    (step) => doc.useServiceAccountAuth(sheetsCred, step),
    (step) => doc.getInfo((err, info) => {
      sheet = info.worksheets[0];
      step();
    }),
    (step) => sheet.setTitle(sheetTitle, step),
    (step) => sheet.setHeaderRow(headers, step),
  ], (err) => {
    if(err) console.log('An error occured', err);
  });
}

// init app-wide vars
const init = async () => {
  twitterClient = new Twitter(twiiterCred);
  doc           = new GoogleSpreadsheet(process.env.SPREADSHEET_KEY);
  seperator     = '=';
  messagePrompt = 'Enter each hashtag seperated by comma or space';
  worksheetId   = 1;
  sheetTitle    = 'Hashtag Stream';
  sheetHeaders  = ['username', 'followersCount', 'tweet'];
  for(let i = 0; i < 80; i++) seperator += '=';
  await initSheet(sheetTitle, sheetHeaders);
};

const maybeConvertToHashtags = (responseArray) => {
  return responseArray.map(word => {
    if(!word.startsWith('#')) return `#${word}`;
    return word;
  });
};

const logData = async (username, followersCount, tweet, cb) => {
  const rowData = {username, followersCount, tweet};
  return sheet.addRow(rowData, cb);
};

const displayData = (username, followersCount, tweet) => {
  console.log(seperator);
  console.log(`[x]  Profile Name: ${username}`);
  console.log(`[x]  Number of followers: ${followersCount}`);
  console.log(`[x]  Tweet: ${tweet}`);
};

const registerStream = (hashtags) => {
  const stream = twitterClient.stream('statuses/filter', { track: `${hashtags}` });
  console.log('[-]  Filter stream based on the following hashtags', hashtags);
  stream.on('data', tweet => {
    const followersCount = tweet.user && tweet.user.followers_count;
    const username = tweet.user && tweet.user.screen_name;
    const { text } = tweet;
    displayData(username, followersCount, text);
    return logData(username, followersCount, text, () => {
      return;
    });
  });

  stream.on('error', error => {
    console.log('stream error', error)
  });
};

const run = async () => {
  await init();
  const response = await inquirer.prompt([{name: 'hashtags', message: messagePrompt,}]);
  const responseArray = response && response.hashtags.split(/[ ,]+/);
  const hashtags      = maybeConvertToHashtags(responseArray);
  await registerStream(hashtags);
};

run();
