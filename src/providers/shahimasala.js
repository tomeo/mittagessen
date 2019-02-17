const axios = require('axios'),
  cheerio = require('cheerio');

module.exports = () => {
  return axios
    .get('http://shahimasala.se/Helsingborg/lunch/')
    .then(response => {
      let $ = cheerio.load(response.data);
      let current = $('.et_pb_section.et_pb_section_1.et_section_regular');
      $ = cheerio.load(current.html());

      let days = [];
      [1, 2, 3, 4, 5].forEach(day => {
        const menuHtml = $(
          `.et_pb_column_${day} .et_pb_bg_layout_light div`
        ).toArray();
        var menu = [];
        var meal = [];
        menuHtml.forEach(h => {
          const text = $(h).text();
          if (text.length === 0 || text.trim() === 0) {
            if (meal.length !== 0) {
              menu.push(meal.join(' '));
              meal = [];
            }
          } else {
            meal.push(text.trim());
          }
        });
        days.push({
          day,
          menu
        });
      });

      return {
        restaurant: 'Shahi Masala',
        days,
        allWeek: 'Otroliga mängder sås'
      };
    });
};
