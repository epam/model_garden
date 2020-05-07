from unittest import TestCase, mock

from requests import HTTPError

from django.test.utils import override_settings
from model_garden.services import CvatService, CVATServiceException
from model_garden.services.cvat import ListRequest, ListResponse, _join_query


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
              "username": "epam_labler",
              "first_name": "Epam",
              "last_name": "Labler",
              "email": "epam@labler.com"
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
        },
      ),
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
        "email": "epam@labler.com"
      },
    )

  def test_get_users_request_fails(self):
    self.session_mock.post.return_value.raise_for_status.side_effect = HTTPError

    with self.assertRaisesRegex(CVATServiceException, "Request to 'http://localhost:8080/api/v1/auth/login' failed"):
      CvatService().get_users()

  def test_create_task(self):
    service = CvatService()
    self.session_mock.post.return_value = mock.Mock(
      status_code=201,
      json=mock.Mock(
        return_value={
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
      )
    )

    task = service.create_task(
      name='test',
      assignee_id=2,
      owner_id=1,
    )

    self.assertEqual(task['id'], 1)
    self.assertEqual(task['name'], 'test')
    self.assertEqual(task['assignee'], 2)
    self.assertEqual(task['owner'], 1)


class TestCvatServiceTasks(TestCase):
  def setUp(self):
    self.session_cls_patcher = mock.patch('model_garden.services.cvat.requests.Session')
    self.session_cls_mock = self.session_cls_patcher.start()
    self.session_mock = self.session_cls_mock.return_value
    self.session_mock.post.return_value = mock.Mock(status_code=200)
    self.session_mock.get.return_value = mock.Mock(
      status_code=200,
      json=mock.Mock(
        return_value={
          'count': 1,
          'next': 'next_link',
          'previous': 'prev_link',
          'results': [
            {
              'id': 1,
              'name': 'foo'
            },
          ],
        },
      ),
    )

  def tearDown(self):
    self.session_cls_patcher.stop()

  def test_tasks(self):
    res = CvatService().tasks(ListRequest())

    self.assertIsInstance(res, ListResponse)
    self.assertEqual(res.count, 1)
    self.assertEqual(res.next_url, 'next_link')
    self.assertEqual(res.prev_url, 'prev_link')
    self.assertEqual(
      res.results[0],
      {
        "id": 1,
        "name": "foo",
      },
    )

  def test_tasks_fails(self):
    self.session_mock.post.return_value.raise_for_status.side_effect = HTTPError

    with self.assertRaisesRegex(CVATServiceException, "Request to .* failed"):
      CvatService().tasks()


class TestJoinQuery(TestCase):
  TEST_CASES = [
    {
      'request': ListRequest(
        page=1,
        page_size=2,
        ordering='name',
        filters={'foo': 'bar', 'baz': 2}
      ),
      'path': 'path',
      'expected': 'path?page=1&page_size=2&foo=bar&baz=2&ordering=name'
    },
    {
      'request': ListRequest(
        page=1,
        page_size=2,
        filters={'foo': 'bar'}
      ),
      'path': 'path',
      'expected': 'path?page=1&page_size=2&foo=bar'
    },
    {
      'request': ListRequest(
        page=1,
        page_size=2,
      ),
      'path': 'path',
      'expected': 'path?page=1&page_size=2'
    },
  ]

  def test_join_queries(self):
    for tc in self.TEST_CASES:
      self.assertEqual(_join_query(tc['path'], tc['request']), tc['expected'])

  def test_path_joined_with_empty_list_request(self):
    req = ListRequest()
    self.assertEqual(_join_query('path', req), 'path?page=1&page_size=100')
