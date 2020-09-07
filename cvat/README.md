# Computer Vision Annotation Tool (CVAT)

## Source Code

* [Official CVAT Repo](github.com/opencv/cvat)

## Installation

### Install CVAT Locally
#### Build Docker
See instructions in [Windows 10 CVAT Installation](github.com/opencv/cvat/blob/develop/cvat/apps/documentation/installation.md#windows-10)
 or in [its internal fork](git.epam.com/epm-emrd/cvat/-/blob/master/cvat/apps/documentation/installation.md#windows-10).

Remember the superuser name and admin to access CVAT admin console. 

```
Username: cvat_admin
Email address: cvat_admin@epam.com
```

The final step is to enter the password.

```
Password: **********
Password (again): *********
Superuser created successfully.
```

### Open CVAT
Check that CVAT is running on `CVAT_HOST`:`CVAT_PORT` (`CVAT_HOST` and
`CVAT_PORT` are specified in [<model_garden_root>/backend/.env](.env) file).

### Add Necessary Users to CVAT
#### Add CVAT Admin
In _`CVAT_HOST`:`CVAT_PORT`/admin/auth/user/_ (for instance,
_localhost:8080/admin/auth/user/_) add `CVAT_ROOT_USER_NAME` with
`CVAT_ROOT_USER_PASSWORD` from [<model_garden_root>/backend/.env](.env) file.

#### Add Test CVAT User
Add 'epam_user' with any password in localhost:8080/admin/auth/user/ panel. 