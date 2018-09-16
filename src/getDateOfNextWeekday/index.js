const getDay = require('date-fns/get_iso_day');
const addDays = require('date-fns/add_days');

module.exports = () => {
  var now = Date.now();
  var day = getDay(now);

  if (day >= 6) {
    return addDays(now, 8 - day);
  }

  return now;
};
