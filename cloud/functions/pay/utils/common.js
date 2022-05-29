function getTime() {
  const time = new Date();
  return `${time.getFullYear()}${(time.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${time
    .getDate()
    .toString()
    .padStart(2, "0")}${time
    .getHours()
    .toString()
    .padStart(2, "0")}${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}${time.getSeconds().toString().padStart(2, "0")}`;
}

module.exports = { getTime };
