const baseStyles = `
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: #0d0d0d;
        margin: 0;
        padding: 0;
        color: #ffffff;
    }
    .container {
        max-width: 520px;
        margin: 48px auto;
        background: #111111;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 0 40px rgba(255,255,255,0.04);
    }
    .header {
        background: #0d0d0d;
        padding: 36px 40px 28px;
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .logo-icon {
        display: inline-flex;
        width: 48px;
        height: 48px;
        background: #ffffff;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
    }
    .logo-diamond {
        width: 20px;
        height: 20px;
        background: #0d0d0d;
        border-radius: 4px;
        transform: rotate(45deg);
    }
    .logo-text {
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: rgba(255,255,255,0.9);
        margin: 0;
    }
    .content {
        padding: 40px;
        text-align: center;
    }
    h1 {
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 12px;
        color: #ffffff;
        letter-spacing: -0.3px;
    }
    .subtitle {
        color: rgba(255,255,255,0.4);
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 32px;
    }
    .otp-box {
        background: #1a1a1a;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 24px 32px;
        display: inline-block;
        margin-bottom: 28px;
    }
    .otp-label {
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.3);
        margin: 0 0 10px;
    }
    .otp-code {
        font-size: 38px;
        font-weight: 700;
        letter-spacing: 10px;
        color: #ffffff;
        margin: 0;
        padding-left: 10px;
    }
    .expiry-note {
        font-size: 13px;
        color: rgba(255,255,255,0.25);
        margin: 0;
    }
    .divider {
        border: none;
        border-top: 1px solid rgba(255,255,255,0.05);
        margin: 28px 0;
    }
    .ignore-note {
        font-size: 12px;
        color: rgba(255,255,255,0.2);
        line-height: 1.6;
        margin: 0;
    }
    .footer {
        padding: 20px 40px;
        text-align: center;
        font-size: 11px;
        color: rgba(255,255,255,0.15);
        border-top: 1px solid rgba(255,255,255,0.05);
        letter-spacing: 0.02em;
    }
`;

// Registration / Email Verification OTP
export const otpTemplate = (otp, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${baseStyles}</style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-icon">
                    <div class="logo-diamond"></div>
                </div>
                <p class="logo-text">Snitch</p>
            </div>
            <div class="content">
                <h1>Verify your email</h1>
                <p class="subtitle">Hi ${name}, welcome! Enter the code below to verify your email address and activate your account.</p>
                <div class="otp-box">
                    <p class="otp-label">verification code</p>
                    <p class="otp-code">${otp}</p>
                </div>
                <p class="expiry-note">This code expires in 5 minutes.</p>
                <hr class="divider">
                <p class="ignore-note">If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Snitch &nbsp;&middot;&nbsp; Empowering search with AI
            </div>
        </div>
    </body>
    </html>
    `;
};

// Password Reset OTP
export const resetPasswordTemplate = (otp, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            ${baseStyles}
            .warning-badge {
                display: inline-block;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 100px;
                padding: 6px 14px;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.08em;
                color: rgba(255,255,255,0.4);
                text-transform: uppercase;
                margin-bottom: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-icon">
                    <div class="logo-diamond"></div>
                </div>
                <p class="logo-text">Snitch</p>
            </div>
            <div class="content">
                <div class="warning-badge">Password Reset</div>
                <h1>Reset your password</h1>
                <p class="subtitle">Hi ${name}, we received a request to reset your password. Use the code below to continue. If this wasn't you, please secure your account.</p>
                <div class="otp-box">
                    <p class="otp-label">reset code</p>
                    <p class="otp-code">${otp}</p>
                </div>
                <p class="expiry-note">This code expires in 5 minutes.</p>
                <hr class="divider">
                <p class="ignore-note">If you didn't request a password reset, ignore this email — your password will remain unchanged.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Snitch &nbsp;&middot;&nbsp; Empowering search with AI
            </div>
        </div>
    </body>
    </html>
    `;
};
