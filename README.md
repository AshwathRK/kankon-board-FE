````markdown
# 📝 Kanban Project Management App

A full-stack Kanban board web application that allows users to manage projects and tasks with an intuitive drag-and-drop interface. The app includes authentication, secure password recovery, and dynamic board functionality.

---

## 🚀 Features

### 🔐 Authentication
- **Login:** Secure login using email and password.
- **Sign-Up:** Create a new account with:
  - First Name
  - Email
  - Password + Confirm Password
  - Security Question & Answer
  - Optional: Phone Number, Address
- **Forgot Password:** 
  - Email verification
  - OTP-based reset flow
  - Set a new password

### 🏠 Home Page
- After login, users are taken to the homepage where they can:
  - Create new projects (with Name and Description)
  - View existing projects

### 📁 Project & Board Management
Inside each project:

    --Create custom columns (e.g., To Do, In Progress, Done)
    
    --Each column has:
    
        --An Add button to create a new card (task)
        
        --A menu (three dots) icon with options:
        
            --Edit: Update the column name and description
            
            --Delete: Remove the entire column
    
    --Create cards inside each column with task details
    
    --Click on any card to view and edit its information (e.g., title, description, status)
    
    --Drag & Drop cards between columns
    
    --Card status is updated automatically based on the destination column title

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux Toolkit
- React Router
- Tailwind CSS
- React DnD or `react-beautiful-dnd` (for drag-and-drop)
- Axios
- Toast notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer (for OTP email)

---

## 🧑‍💻 Getting Started

### Prerequisites
- Node.js
- MongoDB
- A mail service (like Gmail SMTP or Mailtrap for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kanban-board-app.git
   cd kanban-board-app
````

2. **Backend Setup**

   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🌐 Environment Variables

Create a `.env` file in both `client` and `server` folders.

## 📸 Screenshots

> Add screenshots or screen recordings of:
>
> * Login Page
    ![Screenshot 2025-07-03 163935](https://github.com/user-attachments/assets/e6be1462-7151-4c5b-b8d1-3519cfe013c9)
> * Sign-Up Flow
    ![Screenshot 2025-07-03 164256](https://github.com/user-attachments/assets/3d4a6bc6-0cb2-4e01-992b-b2b8d1a02417)
> * Forgot Password Flow
    ![Screenshot 2025-07-03 164343](https://github.com/user-attachments/assets/90fb2468-5ad0-4375-8216-8bcdf20e8fa3)
> * Project Creation
    ![Screenshot 2025-07-03 164459](https://github.com/user-attachments/assets/177ea851-6ff3-4965-8dd2-c19571d0b932)
> * Kanban Board with drag-and-drop
    ![Screenshot 2025-07-03 164626](https://github.com/user-attachments/assets/ea3d5cfb-d7b1-4a45-92d6-cddb9fee0534)
---

## 🧪 Future Enhancements

* User profile editing
* Team collaboration support
* Due dates and reminders
* Activity logs and notifications
* Dark mode

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Contact

For any issues or feedback, feel free to reach out:

**Ashwathaman R**
📧 [ashwathaman.r6@gmail.com](mailto:ashwathaman.r6@gmail.com)
🌐 [LinkedIn](https://www.linkedin.com/in/your-profile)
