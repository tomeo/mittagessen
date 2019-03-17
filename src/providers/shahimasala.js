const axios = require('axios'),
  cheerio = require('cheerio'),
  removeEveryNthElement = require('../removeEveryNthElement');

const url = 'http://shahimasala.se/Helsingborg/lunch/';

module.exports = () => {
  return axios
    .get('http://shahimasala.se/Helsingborg/lunch/')
    .then(response => {
      const $ = cheerio.load(
        cheerio
          .load(response.data)(
            '.et_pb_section.et_pb_section_1.et_section_regular'
          )
          .html()
      );

      const days = [1, 2, 3, 4, 5].map(day => {
        var menu = [];

        const unclean = $(`.et_pb_column_${day} .et_pb_bg_layout_light div`)
          .toArray()
          .map(h =>
            $(h)
              .text()
              .trim()
          )
          .filter(t => t.length);
        const meals = removeEveryNthElement(unclean, 3);

        let meal = [];
        for (let i = 1; i < meals.length + 1; i++) {
          if (i % 2 == 0) {
            meal.push(meals[i - 1]);
            menu.push(meal.join(' '));
            meal = [];
          } else {
            meal.push(meals[i - 1]);
          }
        }

        return {
          day,
          menu
        };
      });

      return {
        restaurant: 'Shahi Masala',
        days,
        allWeek: 'Otroliga mängder sås',
        url
      };
    });
};
