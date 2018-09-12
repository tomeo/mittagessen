const axios = require('axios');
const cheerio = require('cheerio');

module.exports = () => {
  return axios.get('https://mommees.se/').then(response => {
    let $ = cheerio.load(response.data);
    var current = $('.wpb_wrapper > h2')
      .next()
      .next();
    var week = Number(
      $(current)
        .text()
        .match(/\d+/g)
    );
    current = current
      .next()
      .next()
      .next()
      .next()
      .next()
      .next();
    var vegetarian = $(current).text();
    current = current
      .next()
      .next()
      .next()
      .next()
      .next();

    let meals = [1, 2, 3, 4, 5].map(i => {
      var meal = $(current)
        .text()
        .replace('Huvudrätt', '')
        .replace('\n', '');
      current = current.next();
      meal += $(current)
        .text()
        .replace('Tillbehör', '');
      current = current.next().next();
      if (i != 3) {
        current = current.next();
      }
      return {
        day: i,
        menu: meal.split('\n')
      };
    });

    return {
      allWeek: vegetarian,
      days: meals.map(m => ({
        day: m.day,
        menu: m.menu
      }))
    };
  });
};
