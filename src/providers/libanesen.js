module.exports = () => {
  var libanesen = ({
    restaurant: 'Libanesen',
    days: [],
    allWeek: ''
  });

  [1,2,3,4,5].forEach(i => {
    libanesen.days.push({
      day: i,
      menu: ['Alltid gott!']
    });
  });

  return Promise.resolve(libanesen);
};