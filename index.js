const providers = require('./src/providers');
const getDateOfNextWeekday = require('./src/getDateOfNextWeekday');
const getDay = require('date-fns/get_iso_day');
var getISOWeek = require('date-fns/get_iso_week');

const printItem = item => console.log(`=> ${item}`);

const print = menu => {
  let nextWeekDay = getDateOfNextWeekday();
  console.log(`${menu.restaurant}:`);
  if (menu.week !== menu.week) {
    if (getISOWeek(nextWeekDay) !== menu.week) {
      console.log(`WARN: Menu is for week ${menu.week}`);
    }
  }
  var day = getDay(nextWeekDay);
  if (menu.allWeek) {
    printItem(menu.allWeek);
  }
  menu.days.find(d => d.day === day).menu.map(m => printItem(m));
  console.log();
};

const getMenus = () => {
  Promise.all(providers).then(values => {
    values.forEach(value => print(value));
  });
};

getMenus();
