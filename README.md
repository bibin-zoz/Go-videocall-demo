# Video Chat Application

## Description

This project is a video chat application that allows users to create and join rooms for video calls. It features real-time video communication, room management, and WebSocket-based signaling.

## Key Technologies

Go, Gin, Gorilla WebSocket, HTML, CSS, JavaScript.

## Features

- Create and join video chat rooms.
- Real-time video and audio communication.
- Room management with unique IDs.
- WebSocket signaling for peer-to-peer connections.

## Getting Started

### Prerequisites

- Go (version 1.15 or later)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/video-chat-app.git
   cd video-chat-app
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Build and run the application:
   ```bash
   go build
   ./video-chat-app
   ```

### Configuration

No additional configuration is required. The server runs on port 8000 by default.

### Usage

1. Open your browser and navigate to `http://localhost:8000`.
2. Create a new room by sending a POST request to `/create`.
3. Join a room by navigating to `http://localhost:8000/room/{roomID}` with the room ID obtained from the create request.

## API Endpoints

### Create Room

- **URL:** `/create`
- **Method:** `POST`
- **Response:**
  ```json
  {
    "room_id": "generated_room_id"
  }
  ```

### Join Room

- **URL:** `/join`
- **Method:** `GET`
- **Query Parameters:** `roomID`

## Project Structure

- `main.go`: Entry point of the application.
- `rooms.go`: Handles room creation, participant management, and room deletion.
- `signaling.go`: Handles WebSocket signaling for peer-to-peer connections.
- `templates/index.html`: Landing page for creating and joining rooms.
- `templates/room.html`: Room page for video calls.

## HTML and CSS

The `room.html` file is used for the video call interface. It includes the local and remote video elements, and controls for muting, turning off the video, and hanging up.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
