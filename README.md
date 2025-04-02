# **Project: [Exam Freshcode Project]**

## Local Development Setup

This project uses Docker Compose for local development.

### One-Time Environment Reset (First-Time Setup)

- If you previously build this project with command "docker compose -f docker-compose-dev.yaml up --build" you must clean up images and container, otherwise, an errors may occur when creating new database tables

- Run the following script to reset the environment:

```bash
      ./reset-dev.sh
```

- If you have permission denied log use:

```
    chmod +x reset-dev.sh
```

## **Running Docker Containers in Development Mode**

- Command to build images and start containers:
  ```bash
      docker compose -f docker-compose-dev.yaml up --build
  ```

The application is available at: `http://localhost:3000`

- To check the container status:
  ```bash
      sudo docker container inspect exam-freshcode-front-react
  ```
- Command to unbuild images ande cleat containers:
  ```bash
    docker compose -f docker-compose-dev.yaml down -v
  ```

## **Environment Variables**

POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=freshcode-exam-project

API_ENDPOINT=http://localhost:3000

```
  In `.env` at the project root (`docker-compose-dev.yaml`):
```

POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=freshcode-exam-project

## **Bug Fixes**

- Fixed bugs and updated all libraries.
- Converted class components to functional components.
- Removed unused imports and libraries.

## **Layout**

- Added the **"How It Works"** page, accessible from the user menu.

---

## **Dynamic Branding**

- Implemented the **Events Page** to manage dynamic brand updates.
- Users can **create events and set timers**.
- **Stored in LocalStorage** to preserve events after page refresh.
- Navbar badge displays **the number of upcoming events**.

---

## **NoSQL (MongoDB)**

- Implemented a **MongoDB aggregation query** to count records containing `"паровоз"` in `Messages`.
  File: `findMessages.js`

---

## **SQL Database**

- **User count by roles `{admin: 40, customer: 22, ...}`**
  - **File:** `usersController/getUsersByRoles`
- **10% Cashback for customers on orders from December 25 – January 14**
  - **File:** `task8-cashbackForCustomers.pgsql`
- **$10 Reward for the top 3 Creatives with the highest rating**
  - **File:** `paycreativesRewarding.sql`
- **Migrated chats from NoSQL to SQL**
  - **Sequelize models:** `Conversations`, `ConversationParticipants`, `Messages`, `Users`.
  - **ERD Diagram File:** `freshcode-exam-project - public.png`.

---

## **Node.js**

- **Error logging** in `logs/errors.log`.
- **Automated log rotation**
  - Used `node-cron` for daily log copying and cleanup.
  - Log format: `{message, code, time}`.
  - **Files:** `logger.js, loggerErrorHandler.js`.

---

## **Fullstack Updates**

- **Added Moderator role** for offer management.
- **Only Moderators** can approve or reject offers.
- **Email notifications** are sent to Creatives after decision approval.
- **Migrated chats from NoSQL to SQL**, fixed chat duplication.
- **Refactored API requests** for unified controller structure.

---

```

```
