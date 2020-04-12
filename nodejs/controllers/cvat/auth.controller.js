const axios = require('../../utils/axios');
const cvatApi = require('../../constants/cvat-api.constants');

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post(cvatApi.auth.login, {
      username,
      password
    });
    axios.defaults.headers['X-CSRFToken'] = req.cookies.csrftoken;
    axios.defaults.headers['Authorization'] = `Token ${response.data.key}`;
    res.send('success');
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
};

module.exports = {
  login
};