const axios = require('axios'),
  dateFns = require('date-fns'),
  getDay = require('date-fns/get_day'),
  R = require('ramda'),
  cheerio = require('cheerio'),
  cleanString = require('../../cleanString');

const clean = R.pipe(
  cleanString,
  s => s.replace('Gröna smaker', ''),
  s => s.replace('Klassiska smaker', ''),
  s => s.replace('Moderna smaker', ''),
  s => s.trim()
);

const parseMenu = html => {
  if (!html) {
    return [];
  }

  let $ = cheerio.load(html);
  return $('p')
    .toArray()
    .map(p => $(p).text())
    .map(clean);
};

module.exports = () => {
  return axios
    .get(
      `https://www.fazerfoodco.se/api/restaurant/menu/week?language=sv&restaurantPageId=197223&weekDate=${dateFns.format(
        Date.now(),
        'YYYY-MM-DD'
      )}`
    )
    .then(response => {
      return {
        restaurant: 'Hermes',
        allWeek: '',
        days: response.data.LunchMenus.slice(0, 5)
          .map(d => ({
            day: getDay(d.Date),
            date: d.Date,
            menu: parseMenu(d.Html)
          }))
          .filter(w => w.menu)
      };
    });
};
