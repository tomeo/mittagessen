const axios = require('axios');
const cheerio = require('cheerio');

module.exports = () => {
  return axios.get('https://mommees.se/lunchmeny/').then(response => {
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
          menu: [mealText]
        });
      }
    });

    return {
      restaurant: 'Mommees',
      allWeek: 'Veckans gröna',
      days: meals.map(m => ({
        day: m.day,
        menu: m.menu
      }))
    };
  });
};
