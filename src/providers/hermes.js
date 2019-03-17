const axios = require('axios'),
  dateFns = require('date-fns'),
  getDay = require('date-fns/get_day'),
  R = require('ramda'),
  cheerio = require('cheerio'),
  cleanString = require('../cleanString');

const baseUrl =
  'https://www.fazerfoodco.se/api/restaurant/menu/week?language=sv&restaurantPageId=197223&weekDate=';

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

  let ps = $('p')
    .toArray()
    .map(p => $(p).html());

  ps.forEach(p => {
    if (p.includes('<br>')) {
      console.log('HERE', p);
      return p
        .split('<br>')
        .map(clean)
        .filter(p => p.length);
    }
  });

  return ps.map(clean).filter(p => p.length);
};

module.exports = () => {
  var url = `${baseUrl}${dateFns.format(Date.now(), 'YYYY-MM-DD')}`;
  return axios.get(url).then(response => {
    return {
      restaurant: 'Hermes',
      allWeek: '',
      days: response.data.LunchMenus.slice(0, 5)
        .map(d => ({
          day: getDay(d.Date),
          date: d.Date,
          menu: parseMenu(d.Html)
        }))
        .filter(w => w.menu),
      url
    };
  });
};
