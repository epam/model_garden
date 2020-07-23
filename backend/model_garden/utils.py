from typing import Iterator, Sequence, TypeVar

T = TypeVar('T')


def chunkify(arr: Sequence[T], n: int) -> Iterator[Sequence[T]]:
  for i in range(0, len(arr), n):
    yield arr[i:i + n]


def strip_s3_key_prefix(prefix: str, key: str, delimiter: str = '/') -> str:
  """Return the key without the prefix and without the leading delimiter.

  >>> strip_s3_key_prefix('foo', 'foo/bar/baz')
  'bar/baz'
  """
  if not key:
    return key

  if not key.startswith(prefix):
    return key

  suffix = key[len(prefix):]
  if suffix.startswith(delimiter):
    return suffix[len(delimiter):]

  return suffix
