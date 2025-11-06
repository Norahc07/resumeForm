// Vercel Serverless Function to handle resume image upload and email
// This replaces Firebase Cloud Functions for free tier users

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Set CORS headers - must be set before any response
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174',
    'https://resume-form-eight.vercel.app',
    'https://resume-form-eight.vercel.app/admin',
    origin // Allow the requesting origin
  ].filter(Boolean);

  // Allow the origin if it's in the list or allow all for development
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? (allowedOrigins.includes(origin) ? origin : 'https://resume-form-eight.vercel.app')
    : '*';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight request - MUST return early
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { submissionId, imageBase64, fileName, fileType, userEmail, userName } = req.body;

    // Validate required fields
    if (!submissionId || !imageBase64 || !userEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields: submissionId, imageBase64, and userEmail are required' 
      });
    }

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Configure email transporter
    // Using Gmail as default - you can change this to any email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD, // Use App Password for Gmail
      },
    });

    // Alternative: Use SMTP for other email services
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT || 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // Send email with image attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Your Resume - ${userName || 'Resume'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Resume is Ready!</h2>
          <p>Dear ${userName || 'User'},</p>
          <p>Thank you for submitting your resume. Please find your completed resume attached to this email.</p>
          <p>If you have any questions or need to make changes, please contact us.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            <strong>Submitted:</strong> ${new Date().toLocaleDateString()}<br>
            <strong>Email:</strong> ${userEmail}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: fileName || `resume-${submissionId}.png`,
          content: imageBuffer,
          contentType: fileType || 'image/png',
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Resume image uploaded and emailed successfully' 
    });

  } catch (error) {
    console.error('Error in upload-resume API:', error);
    // Make sure CORS headers are still set even on error
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

