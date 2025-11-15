<div align="center">
  <img src="public/assets/favicon/favicon.png" alt="TKJ Inventory Logo" width="120px" />
  <h1>TKJ Inventory</h1>
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

#### Prerequisites
- A **LEMP Stack** (Linux, Nginx, MySQL/MariaDB, PHP) is required.
- **PHP extensions**: `pdo_mysql`, `gd`, `curl`, `mbstring`, `zip`.

#### 1. Server Configuration

**Nginx**
- Edit your Nginx configuration (e.g., `/etc/nginx/nginx.conf`) to allow larger file uploads for evidence photos and backups.
  ```nginx
  http {
      # ... other settings
      client_max_body_size 25M;
  }
  ```

**PHP**
- **(Best Practice)** Set your server's timezone in both `php.ini` files (e.g., `/etc/php/<version>/fpm/php.ini` and `/etc/php/<version>/cli/php.ini`). This is especially important for ensuring the `cron` scheduler runs at the correct local time.
  ```ini
  date.timezone = Asia/Jakarta
  ```

#### 2. Installation Steps

**1. Clone the Repository**
```bash
git clone [https://github.com/aleafarrel-id/tkj-inventory.git](https://github.com/aleafarrel-id/tkj-inventory.git)
```

**2. Move to Web Directory**
```bash
sudo mv tkj-inventory /var/www/html/
```

**3. Configure Nginx Web Root**
- Edit your Nginx server block configuration file (e.g., `/etc/nginx/sites-available/default`).
- **Point the `root` directive to the `/public` directory.**

```nginx
server {
    listen 80;
    server_name your_domain.com;
    root /var/www/html/tkj-inventory/public; # <-- Point here

    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php<your-version>-fpm.sock;
    }

    # Deny access to sensitive directories
    location ~ /(api|config|temp) {
        deny all;
    }
}
```
- Restart Nginx to apply changes:
```bash
sudo systemctl restart nginx
```

**4. Set Up the Database**
- Create the database:
```sql
CREATE DATABASE tkj_inventory;
```
- Import the SQL schema and default admin user:
```bash
mysql -u your_username -p tkj_inventory < /var/www/html/tkj-inventory/tkj_inventory.sql
```
> **Default Admin Credentials:** `username: admin`, `password: admin123`

**5. Update Application Configuration**
- Edit the configuration file: `config/config.ini.php`.
- **Set Application Timezone:** Define the application's centralized timezone. This is a **new requirement**.
  ```php
  define('APP_TIMEZONE', 'Asia/Jakarta');
  ```
- **Fill in Database Credentials:**
  ```php
  define('DB_NAME_CONFIG', 'tkj_inventory');
  define('DB_USER_CONFIG', 'your_username');
  define('DB_PASS_CONFIG', 'your_password');
  ```
- This step is **crucial** for the application to connect to the database.

**6. Set Permissions**
- The web server needs to be able to write to certain directories for image uploads and temporary files.
```bash
# Set ownership to the web server user (e.g., www-data)
sudo chown -R www-data:www-data /var/www/html/tkj-inventory
sudo chmod -R 755 /var/www/html/tkj-inventory

# Make temp and upload directories writable (PENTING UNTUK UPLOAD & BACKUP)
sudo chmod -R 775 /var/www/html/tkj-inventory/temp
sudo chmod -R 775 /var/www/html/tkj-inventory/public/assets/img
sudo chmod -R 775 /var/www/html/tkj-inventory/public/assets/evidence
```

**7. Configure Google Drive Backup & reCAPTCHA**
- **Create a Google Apps Script:**
  - Go to [script.google.com](https://script.google.com).
  - Create a new project.
  - Copy the entire content of `app_script_api.txt` from this repository and paste it into the script editor.
  - Set a strong `SECRET_KEY` inside the script.
  - Deploy the script as a **Web app**.
  - Authorize the script's access to your Google Drive.
  - Copy the generated Web app URL.

- **Update `config/config.ini.php`:**
  - Paste your Web app URL into `GOOGLE_SCRIPT_URL`.
  - Paste your secret key into `GOOGLE_SCRIPT_SECRET`.
  - Create folders in your Google Drive for backups and get their IDs. Paste them into the `GOOGLE_DRIVE_*_FOLDER_ID` constants.

- **Update `config/config.ini.php`:**
  - Paste your site key into `RECAPTCHA_SITE_KEY`.
  - Paste your secret key into `RECAPTCHA_SECRET_KEY`.

**8. Set Up Cronjob (For Auto-Backup)**
- This step is required for the "Automatic Scheduled Backups" feature to function.
- Edit the crontab for the `www-data` user (so the script has correct write permissions for the `temp` directory):
```bash
sudo -u www-data crontab -e
```
- Add the following line at the end of the file to run the scheduler every minute. The script itself handles the timing (daily/weekly/monthly) based on your UI settings.
```cron
* * * * * /usr/bin/php /var/www/html/tkj-inventory/cron/scheduler.php > /dev/null 2>&1
```
- Save and exit the editor. The cronjob is now active.

You're all set! Open your browser and navigate to your domain. 🎉

---

### ❤️ A Note from the Creator

I'm not a professional programmer, but I am an IT enthusiast with a deep passion for exploring technology. This project was born out of a desire to learn and create something useful from the ground up.

Every line of code, every design choice, and the entire application structure is the result of my personal effort and exploration. I hope you find it useful!

---

### 📄 License

Copyright (c) 2025 **Alea Farrel** - All Rights Reserved.