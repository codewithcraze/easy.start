const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Easy Start API Collection</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
            }
            h1, h2 {
                color: #333;
            }
            p {
                color: #555;
            }
            code {
                display: block;
                padding: 10px;
                background: #e9e9e9;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            .container {
                max-width: 800px;
                margin: auto;
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .input-group {
                margin-bottom: 15px;
            }
            label {
                font-weight: bold;
                display: block;
                margin-bottom: 5px;
            }
            input, textarea {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            button {
                padding: 10px 20px;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Easy Start - Backend API Collection</h1>
            <p>This API collection provides a fully-featured backend setup designed for rapid deployment, featuring secure JWT authentication, role management, and access control. It includes an email service for registration and password recovery.</p>

            <h2>Test the APIs</h2>

            <!-- Register -->
            <h3>1. Register</h3>
            <div class="input-group">
                <label>Email</label>
                <input type="text" id="register-email" placeholder="Enter email">
                <label>Password</label>
                <input type="password" id="register-password" placeholder="Enter password">
                <button onclick="register()">Register</button>
            </div>
            <textarea id="register-response" placeholder="Response will be shown here..." rows="5"></textarea>

            <!-- Sign In -->
            <h3>2. Sign In</h3>
            <div class="input-group">
                <label>Email</label>
                <input type="text" id="signin-email" placeholder="Enter email">
                <label>Password</label>
                <input type="password" id="signin-password" placeholder="Enter password">
                <button onclick="signin()">Sign In</button>
            </div>
            <textarea id="signin-response" placeholder="Response will be shown here..." rows="5"></textarea>

            <!-- Forget Password -->
            <h3>3. Forget Password</h3>
            <div class="input-group">
                <label>Email</label>
                <input type="text" id="forget-email" placeholder="Enter email">
                <button onclick="forgetPassword()">Forget Password</button>
            </div>
            <textarea id="forget-response" placeholder="Response will be shown here..." rows="5"></textarea>

            <a href="/download" class="download-link">Download the Postman Collection</a>
        </div>

        <script>
            const baseUrl = 'https://easy-start.codewithdeepak.in/api/auth/v1';

            async function register() {
                const email = document.getElementById('register-email').value;
                const password = document.getElementById('register-password').value;
                const response = await fetch(\`\${baseUrl}/register\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                document.getElementById('register-response').value = JSON.stringify(data, null, 2);
            }

            async function signin() {
                const email = document.getElementById('signin-email').value;
                const password = document.getElementById('signin-password').value;
                const response = await fetch(\`\${baseUrl}/signin\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                document.getElementById('signin-response').value = JSON.stringify(data, null, 2);
            }

            async function forgetPassword() {
                const email = document.getElementById('forget-email').value;
                const response = await fetch(\`\${baseUrl}/forget-password\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();
                document.getElementById('forget-response').value = JSON.stringify(data, null, 2);
            }
        </script>
    </body>
    </html>
    `);
});


module.exports = router;
