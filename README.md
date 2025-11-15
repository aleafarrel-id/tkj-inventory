<div align="center">
  <img src="public/assets/favicon/favicon.png" alt="TKJ Inventory Logo" width="120px" />
  <h1>TKJ Inventory (Container Version)</h1>
  <p>
    A modern, framework-free inventory management system designed to streamline equipment tracking, borrowing, and returns.
  </p>
  <p>
    <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB" />
    <img src="https://img.shields.io/badge/framework-none-blueviolet?style=for-the-badge" alt="Framework-Free" />
  </p>
</div>

---

### ✨ Key Features

This application is built from the ground up to be lightweight, performant, and feature-rich.

#### 📦 Core Inventory & Loan Management
- **Dynamic Stock Control**: Easily add, edit, delete, and view items with image uploads for clear visual identification.
- **Multi-Item Borrowing**: A streamlined workflow allows users to borrow multiple items in a single transaction.
- **Effortless Returns**: A simple process for returning items, complete with mandatory photo proof uploads.
- **Live Search & Filtering**: Instantly find items, active loans, or transaction history with live search and status filters (e.g., available, empty).

#### ⚙️ Powerful Admin Dashboard
- **User & Class Management**: Full CRUD (Create, Read, Update, Delete) functionality for user accounts (Admins/Students) and classes.
- **Asynchronous Backup**: Import, Export, and Backup jobs (including photo uploads) are processed asynchronously in small, reliable batches. This ensures long-running tasks (like uploading hundreds of photos) can complete without server timeouts.
- **Automatic Scheduled Backups**: Fully configurable automated backups (daily, weekly, or monthly) that robustly archive the entire database (SQL dump) and all uploaded assets (item images, evidence photos) into a single `.zip` file on Google Drive.
- **Google Apps Script Integration**: Utilizes a robust backend script for reliable file handling.
- **Insightful Statistics**: A dedicated dashboard with visual charts to track:
    - Most frequent borrowers by class.
    - Currently loaned items (grouped by item name or category).
    - Top 10 most borrowed items from history.
- **System Configuration**:
    - **Borrowing Schedule**: Define specific hours during which students can borrow items.
    - **Manual Lock**: Instantly lock or unlock the borrowing functionality for all non-admin users.

#### ✨ Modern User Experience
- **Fully Responsive**: A clean and intuitive interface that works seamlessly on desktops, tablets, and mobile devices.
- **Light & Dark Modes**: Automatic theme switching that respects user's system preferences, with a manual toggle.
- **Interactive UI**:
    - **Floating Action Buttons (FABs)** for quick access to primary actions like adding items or managing accounts.
    - **Multi-Select**: Select multiple items in the stock view for batch borrowing or deletion.
    - **Custom Modals & Notifications**: A smooth user experience without disruptive browser alerts.

---

### 🛠️ Built From Scratch With

This project is built with a passion for simplicity and performance, using only native technologies without any frameworks.

- **Backend**: **Vanilla PHP**
- **Frontend**: **Vanilla JavaScript (ES6+)**, HTML5, CSS3
- **Database**: **MySQL / MariaDB**
- **Cloud Integration**: **Google Apps Script** for Google Drive uploads.

---

### ⚙️ Deployment Guide

> [!CAUTION]
> Some do not run well on ARM or ARM64 architectures such as Raspberry PI or Ampere CPU. Even if they do run, they cannot run normally. This project was originally designed to run natively on x64 / KVM64.

> [!WARNING]
> Cronjob testing is not yet available, so there is no support for autobackups yet.

#### 📦 Prerequisites

- Docker on host server (No matter what linux distro or OS you use, as long as it can run Docker properly)
- Docker compose

#### 🛠️ Build & Running

1. Clone this repository

   ```bash
   git clone https://github.com/aleafarrel-id/tkj-inventory.git
   cd tkj-inventory
   ```

2. Build the docker image with [bash script](./build.sh), you can change the tag and name as desired (optional).

   With bash script:

   ```bash
   bash build.sh
   ```

   CLI :

   ```bash
   docker build -t tkj-inventory:latest .
   ```

3. Configuration production `docker-compose.yml`, it is already included in the [docker compose file](./docker-compose.yml) in this repository. Simply change the password in the database and other requests such as reCAPTCHA, Google Drive, and Google Scripts.

   ```yml
   services:
     tkj_inventory:
       image: tkjskanesga/tkj-inventory:latest
       container_name: tkj_inventory_app
       restart: always
       depends_on:
         - database
       environment:
         # PHP & Database Env
         - "APP_TIMEZONE=Asia/Jakarta"
         - "DB_HOST_CONFIG=database" # Same on services docker compose
         - "DB_NAME_CONFIG=tkj_inventory"
         - "DB_USER_CONFIG=<username database>"
         - "DB_PASS_CONFIG=<password database>"
         # reCAPTCHA v2
         - "RECAPTCHA_SITE_KEY=<keysite recaptcha>"
         - "RECAPTCHA_SECRET_KEY=<secret recaptcha>"
         # Google Script For Backup
         - "GOOGLE_SCRIPT_URL=<url deployment google scripts>"
         - "GOOGLE_SCRIPT_SECRET=<key google scripts>"
         # Google Drive
         - "GOOGLE_DRIVE_HISTORY_BACKUP_FOLDER_ID="
         - "GOOGLE_DRIVE_STOCK_EXPORT_FOLDER_ID="
         - "GOOGLE_DRIVE_ACCOUNTS_EXPORT_FOLDER_ID="
         - "GOOGLE_DRIVE_AUTOBACKUP_FOLDER_ID="
       volumes:
         - tkj_inventory:/var/www/html/tkj-inventory:rw
       networks:
         - tkj_inventory
    
     webserver:
       image: nginx:stable-alpine
       container_name: tkj_inventory_webserver
       restart: always
       depends_on:
         - database
         - tkj_inventory
       ports:
         - "80:80"
       volumes:
         - tkj_inventory:/var/www/html/tkj-inventory:ro
         - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro # See on file nginx.conf
       networks:
         - tkj_inventory
    
     database:
       image: yobasystems/alpine-mariadb:11
       container_name: tkj_inventory_db
       restart: always
       environment:
         # Database Env
         - "MYSQL_ROOT_PASSWORD=<password root database>"
         - "MYSQL_DATABASE=tkj_inventory"
         - "MYSQL_USER=<username database>"
         - "MYSQL_PASSWORD=<password database>"
       volumes:
         - database_data:/var/lib/mysql
         # MariaDB will automatically perform the first execution for its database structure.
         - ./tkj_inventory.sql:/docker-entrypoint-initdb.d/tkj_inventory.sql:ro
       networks:
         - tkj_inventory

   volumes:
     database_data:
     tkj_inventory:

   networks:
     tkj_inventory:
       driver: bridge
   ```

4. Configure Google Drive Backup & reCAPTCHA
  - **Create a Google Apps Script:**
    - Go to [script.google.com](https://script.google.com).
    - Create a new project.
    - Copy the entire content of [`app_script_api.gs`](./app_script_api.gs) from this repository and paste it into the script editor.
    - Set a strong `SECRET_KEY` inside the script.
    - Deploy the script as a **Web app**.
    - Authorize the script's access to your Google Drive.
    - Copy the generated Web app URL.
  
  - **Create Recaptha Key**
    - Go to [recaptcha admin](https://www.google.com/recaptcha/admin/create?hl=id)
    - Fill the label, domain/host
    - Change type reCAPTCHA to "Challenge (v2)"
    - Select your GCP / Google Cloud Platform
    - Click "Submit" to create.
    - Copy site key and secret key.

  - **Update `docker-compose.yml`:**
    - Fill your Web app URL into `GOOGLE_SCRIPT_URL`.
    - Fill your secret key into `GOOGLE_SCRIPT_SECRET`.
    - Create folders in your Google Drive for backups and get their IDs. Paste them into the `GOOGLE_DRIVE_*_FOLDER_ID` constants.
    - Fill your site key into `RECAPTCHA_SITE_KEY`.
    - Fill your secret key into `RECAPTCHA_SECRET_KEY`.

You're all set! Open your browser and navigate to your domain or IP address. 🎉

---

### ❤️ A Note from the Creator

I'm not a professional programmer, but I am an IT enthusiast with a deep passion for exploring technology. This project was born out of a desire to learn and create something useful from the ground up.

Every line of code, every design choice, and the entire application structure is the result of my personal effort and exploration. I hope you find it useful!

---

### 📄 License

Copyright (c) 2025 **Alea Farrel** - All Rights Reserved.

**🛠️ Additional Contributions:**

This **Dockerized version** was prepared and managed by [@ernestoyoofi](https://github.com/ernestoyoofi).
