

# 🌟 **BudgetWise – Full Stack Personal Budget Management Application**

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![Build](https://img.shields.io/badge/Build-Maven-yellow)
![License](https://img.shields.io/badge/Status-Completed-brightgreen)

---

## 📌 **Overview**

**BudgetWise** is a complete **Full Stack Personal Budget Management** project designed to help users track budgets, expenses, savings goals, and financial performance.
Built using **Spring Boot (backend)** and **React.js (frontend)**.

This system is ideal for full-stack project evaluation and real-world financial tracking.

---

## 🚀 **Key Features**

### 🔐 Authentication

* Register & Login
* JWT-based secure authentication
* Protected frontend routes

### 💰 Budget Module

* Create budgets
* Track spending vs limits
* Edit/Delete budgets

### 🧾 Transaction Module

* Add/Edit/Delete transactions
* Filter by category, date
* Auto-update budget spending

### 🎯 Savings Goals

* Create multiple savings goals
* Add saved amounts
* Track goal progress visually

### 📊 Dashboard Analytics

* Recent transactions
* Monthly summaries
* Budget & goal overview

---

## 🧩 **Tech Stack**

### **Frontend**

* React.js
* React Router
* Axios
* CSS Modules

### **Backend**

* Spring Boot
* Spring Security + JWT
* Hibernate + JPA
* MySQL

---

# 🏗 **System Architecture**

```
      +------------------------------+
      |         React Frontend       |
      | (UI, Pages, Components)      |
      +---------------+--------------+
                      |
                      | REST API (JSON)
                      v
      +---------------------------------------+
      |           Spring Boot Backend         |
      | Controllers | Services | Repositories |
      +---------------+-----------------------+
                      |
                      | MySQL Queries
                      v
      +---------------------------------------+
      |               MySQL Database          |
      +---------------------------------------+
```

---

# 🗄 **Database ER Diagram**

```
+------------------+       1 : N       +-------------------+
|      User        |-------------------|    Transaction    |
+------------------+                   +-------------------+
| id (PK)          |                   | id (PK)           |
| username         |                   | user_id (FK)      |
| email            |                   | amount            |
| password         |                   | category          |
+------------------+                   | description       |
                                       | date              |
                                       +-------------------+

+-------------------+      1 : N      +-------------------+
|       User        |-----------------|       Budget      |
+-------------------+                 +-------------------+
| id (PK)           |                 | id (PK)           |
| username          |                 | user_id (FK)      |
| email             |                 | category          |
| password          |                 | limit_amount      |
+-------------------+                 | spent_amount      |
                                     +--------------------+

+-------------------+       1 : N       +-------------------+
|       User        |--------------------|       Goal        |
+-------------------+                    +-------------------+
| id (PK)           |                    | id (PK)           |
| username          |                    | user_id (FK)      |
| email             |                    | goal_name         |
| password          |                    | target_amount     |
+-------------------+                    | saved_amount      |
                                         +-------------------+
```

---

# 📦 **Project Folder Structure**

```
budgetwise-fullstack/
│
├── backend/          # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
└── frontend/         # React frontend
    ├── src/
    ├── public/
    └── package.json
```

---

# ⚙️ **How to Run the Project**

## 🔧 **Backend Setup (Spring Boot)**

### Step 1 — Configure Database

Edit:
`backend/src/main/resources/application.properties`

```
spring.datasource.url=jdbc:mysql://localhost:3306/budgetwise
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=yourSecretKey
```

### Step 2 — Run Backend

```bash
cd backend
mvn spring-boot:run
```

Runs at: **[http://localhost:8080](http://localhost:8080)**

---

## 🎨 **Frontend Setup (React)**

```bash
cd frontend
npm install
npm start
```

Runs at: **[http://localhost:3000](http://localhost:3000)**

---

# 🔐 **Authentication Flow**

1. User logs in from React
2. Backend validates user
3. Backend returns JWT
4. JWT stored in localStorage
5. All API requests include JWT in Authorization header

---

# 🎯 **Project Demo Flow**

```
Login → Dashboard
→ Add Budget → Add Transactions
→ View Reports → Create Savings Goals
→ Track Progress → Logout
```

---

# 👩‍💻 **Author**

### **Priya Chandrika**

Full Stack Developer
Passionate about building real-world applications and solving meaningful problems.

---

# 🟢 **Project Status: Completed & Ready for Evaluation**

This repository contains the **final full-stack submission** with clean structure, updated `.gitignore`, and organized backend & frontend folders.

---

Just tell me!
