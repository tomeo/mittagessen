const axios = require('axios'),
  cheerio = require('cheerio'),
  R = require('ramda'),
  cleanString = require('../cleanString');

const url = 'https://mommees.se/lunchmeny/';

const clean = R.pipe(
  cleanString,
  s => s.replace(': ', '')
);

module.exports = () => {
  return axios.get(url).then(response => {
    let $ = cheerio.load(response.data);
    let current = $('.wpb_text_column.wpb_content_element .wpb_wrapper');

    let meals = [];
    current.each((i, element) => {
      if (i !== 0) {
        var mealText = $(element)
          .text()
          .replace('MÅNDAG', '')
          .replace('TISDAG', '')
          .replace('ONSDAG', '')
          .replace('TORSDAG', '')
          .replace('FREDAG', '')
          .replace('Huvudrätt', '')
          .replace('Tillbehör', '')
          .replace(/\n/g, ' ')
          .replace(/\s\s+/g, ' ')
          .trim();
        meals.push({
          day: i,
          menu: [clean(mealText)]
        });
      }
    });

    let greenOfTheWeek = 'Not found';
    $('p')
      .toArray()
      .find(pTag => {
        const res = $.html(pTag).match(
          /<\s*span[^>]*>\s*Veckans\sgr&#xF6;na\s*[^>]*>[^>]*>([^<]+)</
        );
        if (res) {
          greenOfTheWeek = clean(res[1]);
          return true;
        }
        return false;
      });

    return {
      restaurant: 'Mommees',
      allWeek: greenOfTheWeek,
      days: meals.map(m => ({
        day: m.day,
        menu: m.menu
      })),
      url
    };
  });
};
