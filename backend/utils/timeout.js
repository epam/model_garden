const timeout = (delay) => {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

const waitUntil = (condition, delay) => {
  return new Promise(resolve => {
    const intervalId = setInterval(() => {
      if (condition) {
        resolve();
        clearInterval(intervalId);
      }
    }, delay);
  });
};

module.exports = {
  timeout,
  waitUntil
}