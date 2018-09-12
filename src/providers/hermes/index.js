const axios = require('axios');
const dateFns = require('date-fns');
const getDay = require('date-fns/get_day');
const decode = require('decode-html');
const cheerio = require('cheerio');

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
        allWeek: '',
        days: response.data.LunchMenus.map(d => ({
          day: getDay(d.Date),
          menu: parseMenu(d.Html)
        })).filter(w => w.menu !== '')
      };
    });
};

const parseMenu = html => {
    if (!html) return [];
    var decoded = decode(html);
    let $ = cheerio.load(decoded);
    return $('p').html().split('<br>');
};