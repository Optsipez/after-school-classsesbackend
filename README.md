# 🧠 AFS Club — After School Classes Backend

This is the backend for the AFS Club platform. It powers the frontend application by serving class listings and handling order submissions via a RESTful API.

✅ **Live API on Render:**
[https://after-school-classsesbackend.onrender.com/collection/Classes](https://after-school-classsesbackend.onrender.com/collection/Classes)

---

## 📦 Features

* REST API to serve after-school class listings
* POST endpoint for order submission
* JSON-based communication
* CORS-enabled for frontend integration
* Hosted on [Render](https://render.com)

---

## 🧰 Tech Stack

* **Node.js** – JavaScript runtime
* **Express.js** – Web server framework
* **CORS** – Cross-origin support
* **Body-parser** – Middleware for JSON handling

---

## 🔌 API Endpoints

* `GET /collection/Classes`
  Returns all available after-school classes

* `POST /collection/orders`
  Accepts submitted orders via JSON payload

### Example POST Payload

```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "classes": ["Coding 101", "Dance Club"]
}
```

---

## 🧪 Testing the API

You can test endpoints using tools like:

* [Postman](https://www.postman.com/)
* `curl` in terminal
* Frontend app at:
  [https://optsipez.github.io/afterschoolclassesvue/](https://optsipez.github.io/afterschoolclassesvue/)

---

## 🔗 Project Links

* 📁 **Backend Repo:**
  [https://github.com/Optsipez/after-school-classsesbackend](https://github.com/Optsipez/after-school-classsesbackend)

* 🎓 **Frontend Repo:**
  [https://github.com/Optsipez/afterschoolclassesvue](https://github.com/Optsipez/afterschoolclassesvue)

* 🌍 **Live Frontend:**
  [https://optsipez.github.io/afterschoolclassesvue/](https://optsipez.github.io/afterschoolclassesvue/)

* ⚙️ **Live API (Render):**
  [https://after-school-classsesbackend.onrender.com/collection/Classes](https://after-school-classsesbackend.onrender.com/collection/Classes)

---

## 👨‍💻 Author

**Vishesh Mundra**

🔗 [LinkedIn](www.linkedin.com/in/visheshh-mundra-231518254)

📧 [vishesh@email.com](mailto:vishesh@email.com)

---
