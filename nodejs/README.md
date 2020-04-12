# Node.js API

Run application:
1. Install Node.js
2. Run `npm install`
3. Run `node app`


## Routes

### CVAT
/cvat

+ POST /auth/login `{username, password}`
+ GET /tasks/:taskId
+ POST /tasks `{
  "name":"NewTask",
    "owner": 1,
    "assignee": 5,
    "labels":[
        {
            "name":"newLabel",
            "attributes":[]
        }
    ],
    "image_quality":70,
    "z_order":true,
    "segment_size":"1",
    "overlap":"1",
    "start_frame":"1",
    "stop_frame":"1",
    "frame_filter":"step=1"
  }`
+ POST /:taskId/images `
    {
      "remote_files": [
        "https://remote_image_url"
      ]
    }`