import dataclasses
import logging
from typing import Optional, List, Dict, NamedTuple
from urllib.parse import urlencode, urlunsplit

import requests
from django.conf import settings
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

logger = logging.getLogger(__name__)


class CVATServiceException(Exception):
  pass


@dataclasses.dataclass
class ListRequest:
  page: int = 1
  page_size: int = 100
  ordering: str = ''
  filters: Dict[str, str] = dataclasses.field(default_factory=dict)


class ListResponse(NamedTuple):
  count: int
  next_url: Optional[str]
  prev_url: Optional[str]
  results: List[dict]


class CvatService:
  API_VERSION = 'v1'

  def __init__(self):
    self._api_url = f"http://{settings.CVAT_HOST}:{settings.CVAT_PORT}/api/{self.API_VERSION}"
    self._adapter = HTTPAdapter(
      max_retries=Retry(
        total=3,
        backoff_factor=0.1,
      ),
    )
    self._session = requests.Session()
    self._session.mount("http://", adapter=self._adapter)
    self._session.mount("https://", adapter=self._adapter)
    self._authenticate()

  def _get_url(self, path: str) -> str:
    return f"{self._api_url}/{path}"

  def _request(self, method: str, path: str, data: dict = None) -> requests.Response:
    url = self._get_url(path)

    logger.info('Cvat request: %s, data=%s', url, data)

    response = getattr(self._session, method)(url=url, json=data)
    try:
      response.raise_for_status()
    except requests.HTTPError as e:
      raise CVATServiceException(f"Request to '{url}' failed ({e}): {response.content}")

    return response

  def _get(self, path: str) -> requests.Response:
    return self._request(method='get', path=path)

  def _post(self, path: str, data: dict) -> requests.Response:
    return self._request(method='post', path=path, data=data)

  def _authenticate(self):
    response = self._post(
      path='auth/login',
      data={
        'username': settings.CVAT_ROOT_USER_NAME,
        'password': settings.CVAT_ROOT_USER_PASSWORD,
      },
    )
    self._session.headers.update({'X-CSRFToken': self._session.cookies['csrftoken']})
    return response

  def get_root_user(self):
    for user in self.get_users():
      if user['username'] == settings.CVAT_ROOT_USER_NAME:
        return user

    raise RuntimeError(f"Failed to find root CVAT user: {settings.CVAT_ROOT_USER_NAME}")

  def get_users(self):
    response = self._get('users')
    return response.json()['results']

  def create_task(
    self,
    name: str,
    assignee_id: int,
    owner_id: int,
    labels: Optional[List] = None,
    image_quality: Optional[int] = 70,
  ) -> dict:
    if labels is None:
      labels = [
        {
          "name": "newLabel",
          "attributes": [],
        }
      ]

    response = self._post('tasks', data={
        "name": name,
        "owner": owner_id,
        "assignee": assignee_id,
        "bug_tracker": "",
        "overlap": None,
        "segment_size": "10",
        "z_order": False,
        "labels": labels,
        "image_quality": image_quality,
        "start_frame": 0,
        "stop_frame": 0,
        "frame_filter": "step=1",
        "project": None
    })
    return response.json()

  def tasks(self, req: ListRequest) -> ListResponse:
    """Fetch tasks from the service that are created by
    `settings.CVAT_ROOT_USER_NAME`.
    """
    req.filters['owner'] = settings.CVAT_ROOT_USER_NAME

    resp = self._get(_join_query('tasks', req))
    data = resp.json()

    return ListResponse(
      count=data.get('count', 0),
      next_url=data.get('next'),
      prev_url=data.get('previous'),
      results=data.get('results', []),
    )


def _join_query(path: str, req: ListRequest) -> str:
  """Add query arguments from `req` to the `path`.
  """
  req_query = dict(page=req.page, page_size=req.page_size, **req.filters)
  if req.ordering:
    req_query.update(ordering=req.ordering)

  return urlunsplit(('', '', path, urlencode(req_query), ''))
