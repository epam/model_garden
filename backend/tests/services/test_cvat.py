from unittest import TestCase, mock

from requests import HTTPError

from model_garden.services import CvatService, CVATServiceException


class TestCvatService(TestCase):
  def setUp(self):
    self.session_cls_patcher = mock.patch('model_garden.services.cvat.requests.Session')
    self.session_cls_mock = self.session_cls_patcher.start()
    self.session_mock = self.session_cls_mock.return_value
    self.session_mock.post.return_value = mock.Mock(status_code=200)
    self.session_mock.get.return_value = mock.Mock(
      status_code=200,
      json=mock.Mock(
        return_value={
          'results': [
            {
              "url": "http://localhost:8080/api/v1/users/1",
              "id": 1,
              "username": "test_labler",
              "first_name": "Epam",
              "last_name": "Labler",
              "email": "epam@labler.com"
            },
          ],
        },
      ),
    )

  def tearDown(self):
    self.session_cls_patcher.stop()

  def test_get_users(self):
    users = CvatService().get_users()

    self.assertEqual(len(users), 1)
    self.assertEqual(
      users[0],
      {
        "url": "http://localhost:8080/api/v1/users/1",
        "id": 1,
        "username": "test_labler",
        "first_name": "Epam",
        "last_name": "Labler",
        "email": "epam@labler.com"
      },
    )

  def test_get_users_request_fails(self):
    self.session_mock.post.return_value.raise_for_status.side_effect = HTTPError

    with self.assertRaisesRegex(CVATServiceException, "Request to 'http://localhost:8080/api/v1/auth/login' failed"):
      CvatService().get_users()
