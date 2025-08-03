# Express MongoDB Server

A lightweight RESTful API server built with **Express.js**, **MongoDB**, **CORS**, and **dotenv**. This server provides a foundation for building full-stack applications with secure and scalable backend support.

npm install @smastrom/react-rating @stripe/react-stripe-js @stripe/stripe-js @tanstack/react-query axios firebase react react-dom react-icons react-id-swiper react-responsive-carousel react-router-dom react-tabs react-tooltip recharts sweetalert2 swiper

## 🧾 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🚀 Features

- Express.js for routing and middleware
- MongoDB for persistent data storage
- CORS support for cross-origin requests
- dotenv for secure environment variable management

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
# 1. Create a new directory and navigate into it
mkdir my-server-site
cd my-server-site

# 2. Initialize a new Node.js project
npm init -y

# 3. Install required dependencies
npm install express mongodb cors dotenv

# 4. (Optional but recommended) Install development tools like nodemon
npm install --save-dev nodemon

# 5. Create the basic folder and file structure
mkdir src
touch src/index.js
touch .env

Deploying a React project to cPanel involves a few key steps to get your production-ready application live. Here's a breakdown of what you need to do:

1. Create a Production Build

Prerequisites: You need Node.js and npm (or yarn) installed on your local machine.

Command: Navigate to your project's root directory in your terminal and run the following command:

Bash

npm run build
This command will create a build folder (or dist if you're using Vite) in your project. This folder contains a highly optimized, minified version of your app's HTML, CSS, and JavaScript files, ready for deployment. This is the only folder you need to upload to your cPanel.

2. Prepare the build Folder for Upload

Compress: For easier and faster uploading, compress the build folder into a .zip file. You can do this by right-clicking the folder and selecting "Compress" or "Send to > Compressed (zipped folder)."

3. Upload and Extract to cPanel

Log In: Access your cPanel account and open the File Manager.

Navigate: Go to the root directory of your website. For the main domain, this is typically public_html. For a subdomain, it would be a folder like public_html/subdomain_name.

Upload: Click the "Upload" button and select the .zip file you created in the previous step.

Extract: Once the upload is complete, select the .zip file in the cPanel File Manager, right-click, and choose "Extract." Make sure to extract the contents directly into your domain's root directory (public_html or the subdomain folder), not into a subfolder.

4. Configure Routing with .htaccess

Create/Edit: React applications are Single-Page Applications (SPAs), which means they handle their own routing on the client side using something like React Router. A traditional web server might return a 404 error when you try to access a route like yourdomain.com/about. To fix this, you need to tell the server to always serve index.html for any requested URL that doesn't correspond to an actual file or directory.

.htaccess file: In your domain's root directory (the same place where you extracted your build files), create a new file named .htaccess (make sure to include the dot at the beginning).

Add Code: Paste the following code into the .htaccess file and save it:

Apache

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
