// Import required modules
import nodemailer from "nodemailer";

// Function to send email with OTP
export const sendEmail = async ({ to, subject, text, html }) => {
	// Create a transporter using Nodemailer
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST || "smtp.ethereal.email",
		port: process.env.SMTP_PORT || 587,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	// Send the email (no attachments needed since we're using an icon)
	await transporter.sendMail({
		from: process.env.SMTP_FROM || "no-reply@LangBridge.app",
		to,
		subject,
		text,
		html,
	});
};

// Function to generate the OTP email template
export const getOTPEmailTemplate = (otp) => `
  <div
    style="
      background-color: #f3f4f6;
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      padding: 1rem;
    "
  >
    <div
      style="
        max-width: 32rem;
        margin: 2rem auto;
        background-color: #ffffff;
        border-radius: 1rem;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      "
    >
      <div
        style="
          background: linear-gradient(to bottom, #0f1729, #14273f);
          padding: 1.5rem;
          text-align: center;
          color: #ffffff;
        "
      >
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          "
        >
          <div
            style="
              width: 2.25rem;
              height: 2.25rem;
              border-radius: 0.5rem;
              background-color: rgba(59, 130, 246, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <span
              style="
                font-size: 1.25rem;
                color: #3b82f6;
              "
            >
              💬
            </span>
          </div>
          <h1
            style="
              font-size: 1.5rem;
              font-weight: bold;
              margin: 0;
              color: #ffffff;
            "
          >
            LangBridge
          </h1>
        </div>
        <p
          style="
            font-size:0.875rem;
            margin-top: 0.5rem;
            color: #d1d5db;
          "
        >
          Chat with flair, anytime, anywhere
        </p>
      </div>
      <div style="padding: 1.5rem">
        <h2
          style="
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e3a8a;
            text-align: center;
            margin-bottom: 1rem;
          "
        >
          Your One-Time Password (OTP)
        </h2>
        <p
          style="
            color: #4b5563;
            font-size: 1rem;
            line-height: 1.5;
            margin: 0 auto;
            text-align: center;
            max-width: 90%;
          "
        >
          Use the OTP below to verify your email address and activate your LangBridge account.
        </p>
        <div
          style="
            background-color: #f9fafb;
            border-radius: 0.75rem;
            padding: 1rem;
            text-align: center;
            font-size: 1.875rem;
            font-weight: 600;
            color: #1d4ed8;
            letter-spacing: 0.1em;
            margin: 1.5rem auto;
            max-width: 12rem;
          "
        >
          ${otp}
        </div>
        <p
          style="
            color: #6b7280;
            font-size: 0.875rem;
            text-align: center;
            margin: 0 auto;
            max-width: 90%;
          "
        >
          This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
        </p>
      </div>
      <hr style="border-color: #e5e7eb; margin: 0;" />
      <div
        style="
          padding: 1rem;
          text-align: center;
          color: #4b5563;
          font-size: 0.875rem;
          background-color: #f9fafb;
        "
      >
        © 2025 LangBridge. All rights reserved.
      </div>
    </div>
  </div>
`;
