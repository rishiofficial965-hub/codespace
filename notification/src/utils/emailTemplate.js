export const welcomeTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0b0b0f;
                margin: 0;
                padding: 0;
                color: #e4e4e7;
            }
            .container {
                max-width: 540px;
                margin: 40px auto;
                background: #12121a;
                border-radius: 24px;
                overflow: hidden;
                border: 1px solid rgba(124, 58, 237, 0.15);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 50px rgba(124, 58, 237, 0.05);
            }
            .header {
                background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
                padding: 40px 40px 32px;
                text-align: center;
                border-bottom: 1px solid rgba(124, 58, 237, 0.1);
            }
            .logo-icon {
                display: inline-flex;
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
                border-radius: 16px;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
                box-shadow: 0 8px 16px rgba(139, 92, 246, 0.25);
            }
            .logo-symbol {
                font-size: 28px;
                color: #ffffff;
                font-weight: 700;
            }
            .logo-text {
                font-size: 18px;
                font-weight: 700;
                letter-spacing: 0.05em;
                color: #ffffff;
                margin: 0;
                text-transform: uppercase;
                background: linear-gradient(to right, #ffffff, #c084fc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .content {
                padding: 40px;
                text-align: left;
            }
            h1 {
                font-size: 26px;
                font-weight: 700;
                margin: 0 0 16px;
                color: #ffffff;
                letter-spacing: -0.5px;
                line-height: 1.2;
            }
            .highlight {
                color: #a78bfa;
            }
            .welcome-text {
                color: #a1a1aa;
                font-size: 15px;
                line-height: 1.6;
                margin: 0 0 24px;
            }
            .feature-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 24px;
            }
            .feature-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 16px;
            }
            .feature-item:last-child {
                margin-bottom: 0;
            }
            .feature-emoji {
                font-size: 20px;
                margin-right: 14px;
                margin-top: 2px;
            }
            .feature-details h3 {
                margin: 0 0 4px;
                font-size: 14px;
                color: #ffffff;
                font-weight: 600;
            }
            .feature-details p {
                margin: 0;
                font-size: 13px;
                color: #71717a;
                line-height: 1.5;
            }
            .cta-button-container {
                text-align: center;
                margin: 32px 0 16px;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: #ffffff !important;
                text-decoration: none;
                padding: 14px 32px;
                font-size: 15px;
                font-weight: 600;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .divider {
                border: none;
                border-top: 1px solid rgba(255, 255, 255, 0.06);
                margin: 32px 0 24px;
            }
            .support-note {
                font-size: 13px;
                color: #52525b;
                line-height: 1.5;
                text-align: center;
                margin: 0;
            }
            .support-note a {
                color: #a78bfa;
                text-decoration: none;
            }
            .footer {
                padding: 24px 40px;
                text-align: center;
                font-size: 12px;
                color: #52525b;
                border-top: 1px solid rgba(255, 255, 255, 0.04);
                letter-spacing: 0.02em;
                background: #0e0e14;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-icon">
                    <span class="logo-symbol">⚡</span>
                </div>
                <p class="logo-text">Capstone Sandbox</p>
            </div>
            <div class="content">
                <h1>Welcome to the future of coding, <span class="highlight">${name}</span>!</h1>
                <p class="welcome-text">Your dynamic cloud development environment is ready. You can now spin up containerized workspaces, orchestrate sandboxes, and collaborate with our built-in AI developer agent in real time.</p>
                
                <div class="feature-card">
                    <div class="feature-item">
                        <span class="feature-emoji">🚀</span>
                        <div class="feature-details">
                            <h3>On-Demand Sandboxes</h3>
                            <p>Provision isolated React + Vite workspaces instantly with full HMR preview support.</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <span class="feature-emoji">🤖</span>
                        <div class="feature-details">
                            <h3>AI Orchestration Agent</h3>
                            <p>Let the LangGraph AI agent build, edit, and refactor files for you using human prompts.</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <span class="feature-emoji">⚡</span>
                        <div class="feature-details">
                            <h3>Lightning Fast HMR</h3>
                            <p>Watch updates reflect in your preview browser under a subsecond via WebSockets.</p>
                        </div>
                    </div>
                </div>

                <div class="cta-button-container">
                    <a href="http://localhost:5173" class="cta-button">Launch Dashboard</a>
                </div>

                <hr class="divider">
                <p class="support-note">Have questions or need help? Check out our <a href="#">documentation</a> or contact our support team.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Capstone Sandbox &nbsp;&middot;&nbsp; Cloud Development Engine
            </div>
        </div>
    </body>
    </html>
  `;
};

export const otpTemplate = (otp, name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0b0b0f;
                margin: 0;
                padding: 0;
                color: #e4e4e7;
            }
            .container {
                max-width: 540px;
                margin: 40px auto;
                background: #12121a;
                border-radius: 24px;
                overflow: hidden;
                border: 1px solid rgba(124, 58, 237, 0.15);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 50px rgba(124, 58, 237, 0.05);
            }
            .header {
                background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
                padding: 40px 40px 32px;
                text-align: center;
                border-bottom: 1px solid rgba(124, 58, 237, 0.1);
            }
            .logo-icon {
                display: inline-flex;
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
                border-radius: 16px;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
                box-shadow: 0 8px 16px rgba(139, 92, 246, 0.25);
            }
            .logo-symbol {
                font-size: 28px;
                color: #ffffff;
                font-weight: 700;
            }
            .logo-text {
                font-size: 18px;
                font-weight: 700;
                letter-spacing: 0.05em;
                color: #ffffff;
                margin: 0;
                text-transform: uppercase;
                background: linear-gradient(to right, #ffffff, #c084fc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .content {
                padding: 40px;
                text-align: center;
            }
            h1 {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 12px;
                color: #ffffff;
                letter-spacing: -0.5px;
            }
            .subtitle {
                color: #a1a1aa;
                font-size: 14px;
                line-height: 1.6;
                margin: 0 0 32px;
            }
            .otp-box {
                background: rgba(124, 58, 237, 0.05);
                border: 1px solid rgba(124, 58, 237, 0.2);
                border-radius: 20px;
                padding: 24px 32px;
                display: inline-block;
                margin-bottom: 28px;
                box-shadow: inset 0 0 20px rgba(124, 58, 237, 0.05);
            }
            .otp-label {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #a78bfa;
                margin: 0 0 12px;
            }
            .otp-code {
                font-size: 40px;
                font-weight: 800;
                letter-spacing: 12px;
                color: #ffffff;
                margin: 0;
                padding-left: 12px;
            }
            .expiry-note {
                font-size: 13px;
                color: #52525b;
                margin: 0;
            }
            .divider {
                border: none;
                border-top: 1px solid rgba(255, 255, 255, 0.06);
                margin: 28px 0;
            }
            .ignore-note {
                font-size: 12px;
                color: #52525b;
                line-height: 1.6;
                margin: 0;
            }
            .footer {
                padding: 24px 40px;
                text-align: center;
                font-size: 12px;
                color: #52525b;
                border-top: 1px solid rgba(255, 255, 255, 0.04);
                letter-spacing: 0.02em;
                background: #0e0e14;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-icon">
                    <span class="logo-symbol">⚡</span>
                </div>
                <p class="logo-text">Capstone Sandbox</p>
            </div>
            <div class="content">
                <h1>Verify your email</h1>
                <p class="subtitle">Hi ${name || "Developer"}, enter the code below to verify your email address and activate your account.</p>
                <div class="otp-box">
                    <p class="otp-label">verification code</p>
                    <p class="otp-code">${otp}</p>
                </div>
                <p class="expiry-note">This code expires in 5 minutes.</p>
                <hr class="divider">
                <p class="ignore-note">If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Capstone Sandbox &nbsp;&middot;&nbsp; Cloud Development Engine
            </div>
        </div>
    </body>
    </html>
  `;
};

export const resetPasswordTemplate = (otp, name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0b0b0f;
                margin: 0;
                padding: 0;
                color: #e4e4e7;
            }
            .container {
                max-width: 540px;
                margin: 40px auto;
                background: #12121a;
                border-radius: 24px;
                overflow: hidden;
                border: 1px solid rgba(239, 68, 68, 0.15);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 50px rgba(239, 68, 68, 0.05);
            }
            .header {
                background: linear-gradient(135deg, #451a03 0%, #0f172a 100%);
                padding: 40px 40px 32px;
                text-align: center;
                border-bottom: 1px solid rgba(239, 68, 68, 0.1);
            }
            .logo-icon {
                display: inline-flex;
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
                border-radius: 16px;
                align-items: center;
                justify-content: center;
                margin-bottom: 16px;
                box-shadow: 0 8px 16px rgba(239, 68, 68, 0.25);
            }
            .logo-symbol {
                font-size: 28px;
                color: #ffffff;
                font-weight: 700;
            }
            .logo-text {
                font-size: 18px;
                font-weight: 700;
                letter-spacing: 0.05em;
                color: #ffffff;
                margin: 0;
                text-transform: uppercase;
                background: linear-gradient(to right, #ffffff, #fca5a5);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .content {
                padding: 40px;
                text-align: center;
            }
            .warning-badge {
                display: inline-block;
                background: rgba(239, 68, 68, 0.06);
                border: 1px solid rgba(239, 68, 68, 0.15);
                border-radius: 100px;
                padding: 6px 16px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.08em;
                color: #ef4444;
                text-transform: uppercase;
                margin-bottom: 20px;
            }
            h1 {
                font-size: 24px;
                font-weight: 700;
                margin: 0 0 12px;
                color: #ffffff;
                letter-spacing: -0.5px;
            }
            .subtitle {
                color: #a1a1aa;
                font-size: 14px;
                line-height: 1.6;
                margin: 0 0 32px;
            }
            .otp-box {
                background: rgba(239, 68, 68, 0.04);
                border: 1px solid rgba(239, 68, 68, 0.15);
                border-radius: 20px;
                padding: 24px 32px;
                display: inline-block;
                margin-bottom: 28px;
                box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.05);
            }
            .otp-label {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #f87171;
                margin: 0 0 12px;
            }
            .otp-code {
                font-size: 40px;
                font-weight: 800;
                letter-spacing: 12px;
                color: #ffffff;
                margin: 0;
                padding-left: 12px;
            }
            .expiry-note {
                font-size: 13px;
                color: #52525b;
                margin: 0;
            }
            .divider {
                border: none;
                border-top: 1px solid rgba(255, 255, 255, 0.06);
                margin: 28px 0;
            }
            .ignore-note {
                font-size: 12px;
                color: #52525b;
                line-height: 1.6;
                margin: 0;
            }
            .footer {
                padding: 24px 40px;
                text-align: center;
                font-size: 12px;
                color: #52525b;
                border-top: 1px solid rgba(255, 255, 255, 0.04);
                letter-spacing: 0.02em;
                background: #0e0e14;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-icon">
                    <span class="logo-symbol">⚠️</span>
                </div>
                <p class="logo-text">Capstone Sandbox</p>
            </div>
            <div class="content">
                <div class="warning-badge">Password Reset</div>
                <h1>Reset your password</h1>
                <p class="subtitle">Hi ${name || "Developer"}, we received a request to reset your password. Use the code below to continue. If this wasn't you, please secure your account immediately.</p>
                <div class="otp-box">
                    <p class="otp-label">reset code</p>
                    <p class="otp-code">${otp}</p>
                </div>
                <p class="expiry-note">This code expires in 5 minutes.</p>
                <hr class="divider">
                <p class="ignore-note">If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Capstone Sandbox &nbsp;&middot;&nbsp; Cloud Development Engine
            </div>
        </div>
    </body>
    </html>
  `;
};
