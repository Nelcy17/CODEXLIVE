# ⚡ CodexLive — Real-time Code Collaborator

CodexLive is a real-time collaborative code editor built using the MERN stack and Socket.io. It allows multiple users to write, edit, and run code together simultaneously.

Features -

💻 Real-time Collaboration: Multiple users can edit the same code simultaneously.

⚡ Socket.io Integration: Instant updates using WebSockets for a seamless live coding experience.

💻 Room-based Sessions: Create or join a room using a unique room ID.

👥 Multiple Users: See active users and their changes in real time.

🧾 Language Support: Write code in multiple programming languages (JavaScript, Python, C++, etc.).

▶️ Code Execution (Judge0 API / backend integration): Run and test your code instantly.


## 🛠️ Tech Stack

|       | Technology |
|-------|-------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Realtime Engine** | Socket.io |
| **Code Execution** | Judge0 API |
| **Version Control** | Git & GitHub |
| **Deployment** | Vercel + Render / Railway |

---

💡 How It Works

A user creates or joins a room with a unique ID.

Socket.io establishes a WebSocket connection for real-time communication.

All code changes are instantly broadcast to every connected user.

Users can run code using the Judge0 API and view shared output.

