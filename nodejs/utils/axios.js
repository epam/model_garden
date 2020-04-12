const axios = require("axios").default;

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-CSRFToken': '',
  'Authorization': ''
};

module.exports = axios;