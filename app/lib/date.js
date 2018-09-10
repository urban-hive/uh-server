const getNearestExactHourDate = arg => {
  if (!arg) throw TypeError('date can not undefined or null');
  let date = arg;
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const hour = date.getHours();
  const beforeExactHourDate = new Date(new Date(date).setHours(hour, 0, 0, 0));
  const afterExactHourDate = new Date(
    new Date(date).setHours(hour + 1, 0, 0, 0)
  );
  return Math.abs(beforeExactHourDate.getTime() - date.getTime()) >
    Math.abs(afterExactHourDate.getTime() - date.getTime())
    ? afterExactHourDate
    : beforeExactHourDate;
};

module.exports = { getNearestExactHourDate };
