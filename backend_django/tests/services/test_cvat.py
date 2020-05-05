from unittest import TestCase, mock

from model_garden.services import CvatService, CVATServiceException


class TestCvatService(TestCase):
  def setUp(self):
    self.requests_patcher = mock.patch('model_garden.services.cvat.requests')
    self.requests_mock = self.requests_patcher.start()
    self.session_mock = self.requests_mock.Session.return_value
    self.session_mock.post.return_value = mock.Mock(status_code=200)
    self.session_mock.get.return_value = mock.Mock(
      status_code=200,
      json=mock.Mock(
        return_value={
          'results': [
            {
              "url": "http://localhost:8080/api/v1/users/1",
              "id": 1,
              "username": "epam_labler",
              "first_name": "Epam",
              "last_name": "Labler",
              "email": "epam@labler.com"
            },
          ],
        },
      ),
    )

  def tearDown(self):
    self.requests_patcher.stop()

  def test_get_users(self):
    users = CvatService().get_users()

    self.assertEqual(len(users), 1)
    self.assertEqual(
      users[0],
      {
        "url": "http://localhost:8080/api/v1/users/1",
        "id": 1,
        "username": "epam_labler",
        "first_name": "Epam",
        "last_name": "Labler",
        "email": "epam@labler.com"
      },
    )

  def test_get_users_request_fails(self):
    self.session_mock.post.return_value = mock.Mock(status_code=400)

    with self.assertRaisesRegex(CVATServiceException, "Request to 'http://localhost:8080/api/v1/auth/login' failed"):
      CvatService().get_users()
