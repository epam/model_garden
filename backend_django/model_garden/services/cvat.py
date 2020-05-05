import requests
from django.conf import settings
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

import logging
logging.basicConfig()


class CVATServiceException(Exception):
  pass


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
    response = getattr(self._session, method)(url=url, data=data)
    if response.status_code != 200:
      raise CVATServiceException(f"Request to '{url}' failed: {response.content}")

    return response

  def _get(self, path: str) -> requests.Response:
    return self._request(method='get', path=path)

  def _post(self, path: str, data: dict) -> requests.Response:
    return self._request(method='post', path=path, data=data)

  def _authenticate(self):
    return self._post(
      path='auth/login',
      data={
        'username': settings.CVAT_ROOT_USER_NAME,
        'password': settings.CVAT_ROOT_USER_PASSWORD,
      },
    )

  def get_users(self):
    response = self._get('users')
    return response.json()['results']
