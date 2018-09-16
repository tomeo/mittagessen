const axios = require('axios');
const dateFns = require('date-fns');
const getDay = require('date-fns/get_day');
const stripHtml = require('../../stripHtml');
const decode = require('decode-html');

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
          .filter(w => w.menu !== '')
      };
    });
};

const parseMenu = html => {
  if (!html) return [];
  return html
    .split('<br />')
    .map(h => stripHtml(h))
    .map(h => decode(h));
};
