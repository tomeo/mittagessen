const axios = require('axios'),
  cheerio = require('cheerio');

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
        var meal = [];

        $(`.et_pb_column_${day} .et_pb_bg_layout_light div`)
          .toArray()
          .forEach(h => {
            const text = $(h)
              .text()
              .trim();
            if ((text.length === 0 || text === 0) && meal.length !== 0) {
              menu.push(meal.join(' '));
              meal = [];
            } else if (meal.length < 2) {
              meal.push(text);
            }
          });

        return {
          day,
          menu
        };
      });

      console.log(days);

      return {
        restaurant: 'Shahi Masala',
        days,
        allWeek: 'Otroliga mängder sås'
      };
    });
};
