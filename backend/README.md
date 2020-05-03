# Node.js API

Run application:
1. Install Node.js
2. Create `.env`
3. Run `npm install`
4. Run `npm start` to run application
5. Run `npm run serve` to run in development mode

## Routes

### API
/api

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