const express = require('express'),
  getDateOfNextWeekday = require('./src/getDateOfNextWeekday'),
  getDay = require('date-fns/get_iso_day'),
  providers = require('./src/providers');

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('host', process.env.HOST || 'localhost');

const getRestaurants = () => {
  return Promise.all(providers).then(restaurants => {
    return restaurants.map(restaurant => {
      let nextWeekDay = getDateOfNextWeekday();
      var day = getDay(nextWeekDay);

      var todaysMenu = restaurant.days.find(d => d.day === day).menu;

      return {
        name: restaurant.restaurant,
        menu: todaysMenu,
        allWeek: restaurant.allWeek
      };
    });
  });
};

const formatOutputForSlack = restaurants => {
  var s = '';
  restaurants.forEach(restaurant => {
    s += `${restaurant.name}:\n`;
    if (restaurant.allWeek) {
      s += `=> ${restaurant.allWeek}\n`;
    }
    if (restaurant.menu && restaurant.menu.length) {
      restaurant.menu.forEach(m => {
        s += `=> ${m}\n`;
      });
    }
    s += '\n';
  });

  return s;
}

app.get('/api/v1/lunch', (_req, res) => {
  return getRestaurants()
    .then(menus =>
      res.status(200).send({
        restaurants: menus
      })
    )
    .catch(err => console.log(err));
});

app.post('/api/v1/lunch', (_req, res) => {
  return getRestaurants().then(restaurants =>
    res.status(200).send(formatOutputForSlack(restaurants))
  );
});

app.get('/', (_req, res) => {
  res.status(200).send('OK');
});

app.listen(app.get('port'), () => {
  console.log(`server running on port ${app.get('port')}`);
});
