const express = require('express'),
  getDateOfNextWeekday = require('./src/getDateOfNextWeekday'),
  getDay = require('date-fns/get_iso_day'),
  providers = require('./src/providers');

const app = express(),
  PORT = 5000;

const getRestaurants = () => {
  return Promise.all(providers).then(restaurants => {
    return restaurants.map(restaurant => {
      let nextWeekDay = getDateOfNextWeekday();
      var day = getDay(nextWeekDay);

      var todaysMenu = restaurant.days
        .find(d => d.day === day)
        .menu;

      if (restaurant.allWeek) {
        todaysMenu.push(restaurant.allWeek);
      }
      
      return {
        restaurant: restaurant.restaurant,
        menu: todaysMenu
      };
    });
  });
};

app.get('/api/v1/lunch', (_req, res) => {
  getRestaurants()
    .then(menus =>
      res.status(200).send({
        restaurants: menus
      })
    )
    .catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
