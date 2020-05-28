from json import dumps
from unittest import TestCase, mock

from django.test.utils import override_settings
from requests import HTTPError, Response

from model_garden.services import CvatService, CVATServiceException


class TestCvatService(TestCase):
  def setUp(self):
    self.session_cls_patcher = mock.patch('model_garden.services.cvat.requests.Session')
    self.session_cls_mock = self.session_cls_patcher.start()
    self.session_mock = self.session_cls_mock.return_value
    self.session_mock.post.return_value = mock.Mock(
      status_code=200,
      content="ok",
    )
    self.data = {
      'results': [
        {
          "url": "http://localhost:8080/api/v1/users/1",
          "id": 1,
          "username": "epam_labler",
          "first_name": "Epam",
          "last_name": "Labler",
          "email": "epam@labler.com",
        },
        {
          "url": "http://localhost:8080/api/v1/users/2",
          "id": 2,
          "username": "admin",
          "first_name": "",
          "last_name": "",
          "email": "",
        },
      ],
    }
    self.session_mock.get.return_value = mock.Mock(
      status_code=200,
      content=dumps(self.data),
      json=mock.Mock(return_value=self.data),
    )

  def tearDown(self):
    self.session_cls_patcher.stop()

  @override_settings(CVAT_ROOT_USER_NAME='admin')
  def test_get_root_user(self):
    user = CvatService().get_root_user()

    self.assertEqual(
      user,
      {
        "url": "http://localhost:8080/api/v1/users/2",
        "id": 2,
        "username": "admin",
        "first_name": "",
        "last_name": "",
        "email": "",
      },
    )

  @override_settings(CVAT_ROOT_USER_NAME='admin')
  def test_get_root_user_not_found(self):
    self.session_mock.get.return_value.json.return_value = {'results': []}

    with self.assertRaisesRegex(RuntimeError, "Failed to find root CVAT user: admin"):
      CvatService().get_root_user()

  def test_get_users(self):
    users = CvatService().get_users()

    self.assertEqual(len(users), 2)
    self.assertEqual(
      users[0],
      {
        "url": "http://localhost:8080/api/v1/users/1",
        "id": 1,
        "username": "epam_labler",
        "first_name": "Epam",
        "last_name": "Labler",
        "email": "epam@labler.com",
      },
    )

  def test_get_users_request_fails(self):
    self.session_mock.post.return_value.raise_for_status.side_effect = HTTPError

    with self.assertRaisesRegex(CVATServiceException, "Request to 'http://localhost:8080/api/v1/auth/login' failed"):
      CvatService().get_users()

  def test_get_user(self):
    self.session_mock.get.return_value.json.return_value = {
      'url': 'http://localhost:8080/api/v1/users/1',
      'id': 1,
      'username': 'epam_labler',
      'first_name': 'Epam',
      'last_name': 'Labler',
      'email': 'epam@labler.com',
      'groups': [
          'annotator',
      ],
      'is_staff': False,
      'is_superuser': False,
      'is_active': True,
      'last_login': '2020-05-05T00:32:08.616028Z',
      'date_joined': '2020-05-04T17:03:01Z',
    }
    user = CvatService().get_user(user_id=1)

    self.assertEqual(user['username'], 'epam_labler')

  def test_create_task(self):
    data = {
      'url': 'http://localhost:8080/api/v1/tasks/1',
      'id': 1,
      'name': 'test',
      'size': 0,
      'mode': '',
      'owner': 1,
      'assignee': 2,
      'bug_tracker': '',
      'created_date': '2020-05-07T18:17:39.484093Z',
      'updated_date': '2020-05-07T18:17:39.484127Z',
      'overlap': None,
      'segment_size': 10,
      'z_order': False,
      'status': 'annotation',
      'labels': [
        {
          'id': 1,
          'name': 'newLabel',
          'attributes': [],
        },
      ],
      'segments': [],
      'image_quality': 70,
      'start_frame': 0,
      'stop_frame': 0,
      'frame_filter': 'step=1',
      'project': None,
    }
    self.session_mock.post.return_value = mock.Mock(
      status_code=201,
      content=dumps(data),
      json=mock.Mock(
        return_value=data,
      ),
    )

    task = CvatService().create_task(
      name='test',
      assignee_id=2,
      owner_id=1,
      remote_files=[
        "https://d3o54g14k1n39o.cloudfront.net/batch_2020-05-08/image.jpg",
      ],
    )

    self.assertEqual(task['id'], 1)
    self.assertEqual(task['name'], 'test')
    self.assertEqual(task['assignee'], 2)
    self.assertEqual(task['owner'], 1)

  def test_get_task(self):
    self.session_mock.get.return_value.json.return_value = {
        'id': 1,
        'name': 'foo',
    }

    response = CvatService().get_task(task_id=1)

    self.assertEqual(
      response,
      {
        'id': 1,
        'name': 'foo',
      },
    )

  @mock.patch('model_garden.services.cvat.sleep')
  def test_get_annotations(self, sleep_mock):
    self.session_mock.get.side_effect = [
      mock.Mock(
        status_code=202,
        content=b'',
      ),
      mock.Mock(
        status_code=201,
        content=b'',
      ),
      mock.Mock(
        status_code=200,
        content=b'content',
      ),
    ]

    response = CvatService().get_annotations(
      task_id=1,
      task_name='test',
    )

    self.assertEqual(response, b'content')
    self.assertEqual(sleep_mock.call_count, 2)

  @mock.patch('model_garden.services.cvat.sleep')
  def test_get_annotations_not_created(self, sleep_mock):
    self.session_mock.get.return_value = mock.Mock(
      status_code=202,
      content=b'',
    )

    with self.assertRaisesRegex(CVATServiceException, r"Failed to get annotations \[202\]: b''"):
      CvatService().get_annotations(
        task_id=1,
        task_name='test',
      )

    self.assertEqual(sleep_mock.call_count, 10)

  def test_delete_task(self):
    resp = Response()
    resp.status_code = 204
    self.session_mock.delete.return_value = resp

    CvatService().delete_task(task_id=1)

    self.session_mock.delete.assert_called_once()

  def test_delete_task_failed(self):
    resp = Response()
    resp.status_code = 404
    self.session_mock.delete.return_value = resp

    with self.assertRaises(CVATServiceException):
      CvatService().delete_task(task_id=1)
