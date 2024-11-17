const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Easy Start API Collection</title>
    <meta name="description" content="Get started quickly with a fully-featured backend API collection for secure JWT authentication, role management, access control, and email services for user registration and password recovery. Perfect for rapid deployment and robust backend development.">
<meta name="keywords" content="Backend API collection, JWT authentication, role management, access control, password recovery, secure API, email services API, quick start backend, API deployment, Node.js backend, REST API, rapid backend setup">

    <style>
        /* Global Styles */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 10px;
            background-color: #f0f2f5;
        }

        h1, h2, h3 {
            color: #333;
        }

        p {
            color: #666;
        }

        .container {
            max-width: 900px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .input-group {
            margin-bottom: 20px;
        }

        label {
            font-weight: bold;
            display: block;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            height: 40px;
            border: 1px solid #ddd;
            border-radius: 6px;
            margin-bottom: 10px;
            font-size: 14px;
        }

        textarea {
            width: 100%;
            height: 100px;
            border: 1px solid #ddd;
            border-radius: 6px;
            margin-bottom: 10px;
            font-size: 14px;
        }

        button {
            padding: 12px 24px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #0056b3;
        }

        .api-details {
            display: none;
            margin-top: 10px;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }

        textarea {
            resize: vertical;
            font-family: monospace;
            background-color: #f8f9fa;
        }

        .download-link {
            display: block;
            margin-top: 20px;
            text-align: center;
            color: #007bff;
            font-weight: bold;
            padding: 6px;
            border-radius: 5px;
            text-decoration: none;
            border: 2px solid black;
        }

        .download-link:hover {
            text-decoration: none;
            background-color: 
        }

        .toggle-btn {
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            margin-bottom: 10px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        .toggle-btn:hover {
            background-color: #218838;
        }

        .loading-spinner {
            display: none;
            margin: 10px auto;
            width: 30px;
            height: 30px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-top: 3px solid #007bff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        
        .links{
            display: flex; 
            justify-content: space-between;
            align-items: center;
        }

        @media screen and (max-width: 768px) {
            .container {
                padding: 10px;
                margin: 0px 0px 0px 0px;
            }

            h1 {
                font-size: 24px;
            }

            button, .toggle-btn {
                font-size: 12px;
                padding: 10px 18px;
            }

            textarea {
                font-size: 12px;
            }
            
            .links{
                display: block;
            }
            body{
                margin: 0px !important;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Easy Start - Backend API Collection</h1>
     <div class="links">
    <div><a href="https://github.com/codewithcraze/easy.start" class="download-link">Github Repo</a></div>
    <div><a href="/download" class="download-link">Download the Postman Collection</a></div>
</div>

        <p>This API collection provides a fully-featured backend setup designed for rapid deployment, featuring secure JWT authentication, role management, and access control. It includes an email service for registration and password recovery.</p>

        <h2>Test the APIs</h2>

        <!-- Register -->
        <h3>1. Register</h3>
        <p>This API registers a new user with their email and password and send them email.</p>
        
        <button class="toggle-btn" onclick="toggleApiDetails('register')">Try API</button>
        <div id="register" class="api-details">
            <div class="input-group">
                <label>Email</label>
                <input type="text" id="register-email" placeholder="Enter email">
                <label>Password</label>
                <input type="password" id="register-password" placeholder="Enter password">
                <button onclick="register()">Register</button>
            </div>
            <!-- Loading spinner for Register API -->
            <div id="register-spinner" class="loading-spinner"></div>
            <textarea id="register-response" placeholder="Response will be shown here..." rows="5"></textarea>
        </div>

        <!-- Sign In -->
        <h3>2. Sign In</h3>
        <p>This API authenticates a user with their email and password.</p>
        <button class="toggle-btn" onclick="toggleApiDetails('signin')">Try API</button>
        <div id="signin" class="api-details">
            <div class="input-group">
                <label>Email</label>
                <input type="text" id="signin-email" placeholder="Enter email">
                <label>Password</label>
                <input type="password" id="signin-password" placeholder="Enter password">
                <button onclick="signin()">Sign In</button>
            </div>
            <!-- Loading spinner for Sign In API -->
            <div id="signin-spinner" class="loading-spinner"></div>
            <textarea id="signin-response" placeholder="Response will be shown here..." rows="5"></textarea>
        </div>

        <!-- Forget Password -->
        <h3>3. Forget Password</h3>
        <p>This API initiates the password recovery process by sending a reset email.</p>
        <button class="toggle-btn" onclick="toggleApiDetails('forget')">Try API</button>
        <div id="forget" class="api-details">
            <div class="input-group">
                <label>Email</label>
                <input type="text" id="forget-email" placeholder="Enter email">
                <button onclick="forgetPassword()">Forget Password</button>
            </div>
            <!-- Loading spinner for Forget Password API -->
            <div id="forget-spinner" class="loading-spinner"></div>
            <textarea id="forget-response" placeholder="Response will be shown here..." rows="5"></textarea>
        </div>

        <!-- Reset Password -->
        <h3>4. Change Password</h3>
        <p>This API resets the password using a token from the password recovery email.</p>
        <button class="toggle-btn" onclick="toggleApiDetails('reset')">Try API</button>
        <div id="reset" class="api-details">
            <div class="input-group">
                <label>New Password</label>
                <input type="password" id="new-password" placeholder="Enter New Password">
                <label>Token</label>
                <input type="text" id="token" placeholder="Enter the token from email">
                <button onclick="resetPassword()">Reset Password</button>
            </div>
            <!-- Loading spinner for Reset Password API -->
            <div id="reset-spinner" class="loading-spinner"></div>
            <textarea id="reset-response" placeholder="Response will be shown here..." rows="5"></textarea>
        </div>
    </div>

    <script>
        const baseUrl = 'https://easy-start.codewithdeepak.in/api/auth/v1';

        function toggleApiDetails(apiId) {
            const details = document.getElementById(apiId);
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
            } else {
                details.style.display = 'none';
            }
        }

        function showLoadingSpinner(api) {
            document.getElementById(\`\${api}-spinner\`).style.display = 'block';
        }

        function hideLoadingSpinner(api) {
            document.getElementById(\`\${api}-spinner\`).style.display = 'none';
        }

        async function register() {
            showLoadingSpinner('register');
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const response = await fetch(\`\${baseUrl}/register\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            document.getElementById('register-response').value = JSON.stringify(data, null, 2);
            hideLoadingSpinner('register');
        }

        async function signin() {
            showLoadingSpinner('signin');
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            const response = await fetch(\`\${baseUrl}/signin\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            document.getElementById('signin-response').value = JSON.stringify(data, null, 2);
            hideLoadingSpinner('signin');
        }

        async function forgetPassword() {
            showLoadingSpinner('forget');
            const email = document.getElementById('forget-email').value;
            const response = await fetch(\`\${baseUrl}/forget-password\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            document.getElementById('forget-response').value = JSON.stringify(data, null, 2);
            hideLoadingSpinner('forget');
        }

        async function resetPassword() {
            showLoadingSpinner('reset');
            const password = document.getElementById('new-password').value;
            const token = document.getElementById('token').value;
            const response = await fetch(\`\${baseUrl}/reset-password\`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, token })
            });
            const data = await response.json();
            document.getElementById('reset-response').value = JSON.stringify(data, null, 2);
            hideLoadingSpinner('reset');
        }
    </script>
</body>

</html>
`);
});

module.exports = router;
