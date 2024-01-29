[![Linkedin](https://img.shields.io/badge/Author-fredsrocha-yellow?style=&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/fredsrocha/)
![PWA Offline First](https://img.shields.io/badge/PWA-Offline_First-df2a2a)
![Version](https://img.shields.io/badge/Version-1.0-black)
[![Demo](https://img.shields.io/badge/Demo-ON-success)](https://offline.jusblog.com/)

# :mobile_phone_off: Offline First :fire:

This is an OFFLINE-FIRST Progressive Web Application (PWA). Designed to provide an uninterrupted user experience even without an internet connection. This project is a web application for task management. Featuring a responsive design and an "Offline First" approach, it enables users to create, edit, delete, and sync tasks, maintaining productivity even without an active internet connection. :iphone: Demo [Aqui](https://offline.jusblog.com/)

![PWA Offline First](https://offline.jusblog.com/assets/img/screenshot/desktop.png)

## :white_check_mark: Features

- **Task Creation**: Add new tasks to your list.
- **Task Editing**: Update the content of an existing task.
- **Task Deletion**: Remove tasks that are no longer needed.
- **Offline Sync**: Changes made offline are synchronized when the connection is reestablished.
- **Connection Status Indicator**: View your connection status (Online/Offline).
- **Responsive Design**: The interface adapts to different screen sizes.

## :computer: Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Service Workers for caching and offline resources
- LocalStorage for local data storage

## :globe_with_meridians: API

- **Base URL:** `https://[URL]/api/v1`
- **Content-Type:** `application/json`

### :triangular_flag_on_post: CREATE A TASK

- **URI:** `/create.php`
- **Method:** `POST`
- **Description:** This endpoint creates a new task in the application.

#### REQUEST

**Parameters:**

- **text:** Required. The text of the task.
- **status:** Optional. The status of the task. Valid values are "pending" or "completed". Defaults to "pending".

**Body:**

```json
  {
    "text": "Task text",
    "status": "pending"
  }
```

#### RESPONSE

**Status:** `200 OK`

```json
{
  "message": "Task was created.",
  "id": 123
}
```

#### ERRORS

- **400 Bad Request:** Invalid data (e.g., missing "text" field).
- **500 Internal Server Error:** Unexpected server error.

**Status:** `400 Bad Request`

```json
{
  "message": "Incomplete data. Please provide the 'text' field."
}
```

**OR**

```json
{
  "message": "Invalid status. Please provide 'pending' or 'completed'."
}
```

**Status:** `500 Internal Server Error`

```json
{
  "message": "Unable to create task."
}
```

**OR**

```json
{
  "message": "Internal server error."
}
```

#### Additional Notes

- The request body must be a valid JSON object.
- The "text" field is required.
- The "status" field is optional and defaults to "pending".
- The response body is a JSON object with the following properties: 
    - **message**: A message indicating the success or failure of the request;
    - **id**: The ID of the created task.

### :triangular_flag_on_post: GET ALL TASKS

- **URI:** `/read.php`
- **Method:** `GET`
- **Description:** This endpoint retrieves all tasks from the application.

#### RESPONSE

**Status:** `200 OK`

```json
[
  {
    "id": 1,
    "text": "Task 1",
    "status": "pending",
    "created_at": "2024-01-26 17:37:00"
  },
  {
    "id": 2,
    "text": "Task 2",
    "status": "completed",
    "created_at": "2024-01-25 10:00:00"
  }
]
```

#### ERRORS

- **500 Internal Server Error:** Unexpected server error.

**Status:** `500 Internal Server Error`

```json
{
  "message": "Failed to retrieve tasks."
}
```

#### Additional Notes:

- The response body is a JSON array of tasks.
- Each task object has the following properties:
    - **id:** The ID of the task.
    - **text:** The text of the task.
    - **status:** The status of the task (pending or completed).
    - **created_at:** The date and time when the task was created.

### :triangular_flag_on_post: GET A TASK

- **URI:** `/read_single.php`
- **Method:** `GET`
- **Description:** This endpoint retrieves a specific task by its ID.

#### REQUEST

**Parameters:**

- **id:** Required. The ID of the task to retrieve.

#### RESPONSE

**Status:** `200 OK`

```json
{
  "id": 1,
  "text": "Task 1",
  "status": "pending",
  "created_at": "2024-01-26 17:37:00",
  "updated_at": "2024-01-26 17:45:00"
}
```

#### ERRORS

- **400 Bad Request:** ID not provided.
- **404 Not Found:** Task not found.
- **500 Internal Server Error:** Unexpected server error.

**Status:** `400 Bad Request`

```json
{
  "message": "ID not provided"
}
```

**Status:** `404 Not Found`

```json
{
  "message": "Task not found."
}
```

**Status:** `500 Internal Server Error`

```json
{
  "message": "Failed to retrieve task."
}
```

#### Additional Notes:

- The id parameter must be provided in the query string.
- The response body is a JSON object containing the task details.
- The task object has the following properties:
    - **id:** The ID of the task.
    - **text:** The text of the task.
    - **status:** The status of the task (pending or completed).
    - **created_at:** The date and time when the task was created.
    - **updated_at:** The date and time when the task was last updated.

### :triangular_flag_on_post: UPDATE A TASK

- **URI:** `/update.php`
- **Method:** `PUT`
- **Description:** This endpoint updates an existing task in the application.

#### REQUEST

**Parameters:**

- **id:** Required. The ID of the task to update.
- **text:** Optional. The new text for the task.
- **status:** Optional. The new status for the task. Valid values are "pending" or "completed".

**Body:**

```json
{
  "id": 123,
  "text": "Updated task text",
  "status": "completed"
}
```

#### RESPONSE

**Status:** `200 OK`

```json
{
  "message": "Task was updated."
}
```

#### ERRORS

- **400 Bad Request:** Incomplete or invalid data.
- **404 Not Found:** Task not found.
- **500 Internal Server Error:** Unexpected server error.

**Status:** `400 Bad Request`

```json
{
  "message": "Incomplete or invalid data."
}
```

**Status:** `404 Not Found`

```json
{
  "message": "Task not found."
}
```

**Status:** `500 Internal Server Error`

```json
{
  "message": "Unable to update task."
}
```

#### Additional Notes:

- The id parameter is required and must be a valid integer.
- The text and status parameters are optional.
- The response body is a JSON object with a success message.
- The endpoint uses prepared statements to prevent SQL injection attacks.
- The endpoint validates the status field to ensure it's either "pending" or "completed".

### :triangular_flag_on_post: UPDATE A FIELD TASK

- **URI:** `/update_single.php`
- **Method:** `PATCH`
- **Description:** This endpoint updates specific fields of a single task in the application.

#### REQUEST

**Parameters:**

- **id:** Required. The ID of the task to update.
- **text:** Optional. The new text for the task.
- **status:** Optional. The new status for the task. Valid values are "pending" or "completed".

**Body:**

```json
{
  "id": 123,
  "text": "Updated task text",
  "status": "completed"
}
```

#### RESPONSE

**Status:** `200 OK`

```json
{
  "message": "Task was updated.",
  "updated_at": "2024-01-26 22:45:00"
}
```

#### ERRORS

- **400 Bad Request:** Incomplete or invalid data.
- **404 Not Found:** Task not found.
- **500 Internal Server Error:** Unexpected server error.

**Status:** `400 Bad Request`

```json
{
  "message": "Incomplete or invalid data."
}
```

**Status:** `404 Not Found`

```json
{
  "message": "Task not found."
}
```

**Status:** `500 Internal Server Error`

```json
{
  "message": "Unable to update task."
}
```

#### Additional Notes:

- The id parameter is required and must be a valid integer.
- The text and status parameters are optional, but one of them must be chosen to change.
- The endpoint only updates the fields that are provided in the request body.
- The response body includes the updated updated_at timestamp.
- The endpoint uses prepared statements to prevent SQL injection attacks.
- The endpoint validates the status field to ensure it's either "pending" or "completed".

### :triangular_flag_on_post: DELETE A TASK

- **URI:** `/delete.php`
- **Method:**  `DELETE`
- **Description:** This endpoint allows you to remove an existing task from the application, keeping your to-do list organized.

#### REQUEST

**Parameters:**

- **id:** (Required) The unique identifier of the task to be deleted.

**Body:**

```json
{
  "id": 123
}
```

#### RESPONSE

**Status:** `200 OK`

```json
{
  "message": "Task was deleted."
}
```

#### ERRORS

- **400 Bad Request:** Invalid data provided (e.g., missing or invalid "id" field).
- **404 Not Found:** Task with the specified ID does not exist.
- **500 Internal Server Error:** An unexpected error occurred on the server.

**Status:** `400 Bad Request`

```json
{
  "message": "Incomplete or invalid data."
}
```

**Status:** `404 Not Found`

```json
{
  "message": "Task with the specified ID does not exist."
}
```

**Status:** `500 Internal Server Error`

```json
{
  "message": "Unable to delete task."
}
```

**OR**

```json
{
  "message": "Failed to delete task."
}
```

#### Additional Notes:

- The request body must contain a valid JSON object with the **id** field.
- The **id** field must be a valid integer representing an existing task.
- The response body provides a **message** indicating the outcome of the deletion request.

## :gift: License

This project is under the [MIT](LICENSE) license. See the `LICENSE` file for more details.
