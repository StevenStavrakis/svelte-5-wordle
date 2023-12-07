import cheerio from 'cheerio';
import fs from 'fs';

const url = 'https://www.wordunscrambler.net/word-list/wordle-word-list';

fetch(url)
  .then(response => response.text())
  .then(body => {
    const $ = cheerio.load(body);
    const wordList = [];

    $('li').each(function() {
      wordList.push($(this).text().trim());
    });

    // Write to a JSON file
    fs.writeFile('wordleWords.json', JSON.stringify(wordList, null, 2), err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Words saved to wordleWords.json');
    });
  })
  .catch(console.error);
