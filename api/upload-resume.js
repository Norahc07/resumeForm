// Vercel Serverless Function to handle resume image upload and email
// This replaces Firebase Cloud Functions for free tier users

const nodemailer = require('nodemailer');

// Vercel serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers - must be set before any response
  const origin = req.headers.origin;
  
  // Allow all Vercel deployments (production and preview)
  const isVercelDeployment = origin && (
    origin.includes('vercel.app') || 
    origin.includes('localhost') ||
    origin.includes('127.0.0.1')
  );

  // Allow the origin if it's a Vercel deployment or localhost
  const allowedOrigin = isVercelDeployment ? origin : '*';

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

    // Validate email credentials are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email credentials not configured');
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'EMAIL_USER and EMAIL_PASSWORD environment variables must be set in Vercel'
      });
    }

    // Configure email transporter
    // Using Gmail as default - you can change this to any email service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
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
      subject: `Your Resume is Ready - ${userName || 'Resume'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5; padding: 20px;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Thank You!</h1>
                      <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Your Resume is Ready</p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px 0; color: #1f2937; font-size: 16px; line-height: 1.6;">
                        Dear <strong>${userName || 'Valued Applicant'}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 20px 0; color: #374151; font-size: 15px; line-height: 1.7;">
                        Thank you for submitting your resume through our Resume Form application. We appreciate the time and effort you took to complete your profile.
                      </p>
                      
                      <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 6px;">
                        <p style="margin: 0 0 10px 0; color: #1e40af; font-size: 15px; font-weight: 600;">
                          📎 Your Completed Resume
                        </p>
                        <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
                          Please find your completed resume attached to this email. You can download and use it for your job applications.
                        </p>
                      </div>
                      
                      <p style="margin: 20px 0; color: #374151; font-size: 15px; line-height: 1.7;">
                        We have successfully processed your resume submission and your document is now ready. If you have any questions, need to make changes, or require assistance, please don't hesitate to contact us.
                      </p>
                      
                      <p style="margin: 20px 0 0 0; color: #374151; font-size: 15px; line-height: 1.7;">
                        We wish you the best of luck in your career journey!
                      </p>
                      
                      <p style="margin: 30px 0 10px 0; color: #374151; font-size: 15px; line-height: 1.7;">
                        Best regards,<br>
                        <strong style="color: #2563eb;">Resume Form Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="padding: 0;">
                            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                              <strong>Submission Details:</strong>
                            </p>
                            <p style="margin: 0 0 5px 0; color: #9ca3af; font-size: 11px;">
                              <strong>Name:</strong> ${userName || 'N/A'}<br>
                              <strong>Email:</strong> ${userEmail}<br>
                              <strong>Submitted:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0 0 0; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
                              This is an automated email. Please do not reply to this message.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: fileName || `resume-${submissionId}.png`,
          content: imageBuffer,
          contentType: fileType || 'image/png',
        },
      ],
    };

    // Send email with image attachment
    const emailResult = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: emailResult.messageId,
      to: userEmail,
      from: process.env.EMAIL_USER
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Resume image uploaded and emailed successfully',
      emailId: emailResult.messageId
    });

  } catch (error) {
    console.error('Error in upload-resume API:', error);
    // Make sure CORS headers are still set even on error
    const origin = req.headers.origin;
    const isVercelDeployment = origin && (
      origin.includes('vercel.app') || 
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    );
    const allowedOrigin = isVercelDeployment ? origin : '*';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

