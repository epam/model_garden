

POSIX_SLASH = '/'
WIN_SLASH = '\\'


def remove_leading_slash(path: str) -> str:
  if path.startswith(POSIX_SLASH) or path.startswith(WIN_SLASH):
    return path[1:]
  return path
