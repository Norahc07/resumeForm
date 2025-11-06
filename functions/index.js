const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Get app ID from environment or use default
const APP_ID = process.env.APP_ID || 'resume-builder';

/**
 * Convert resume HTML to image and send via email
 */
exports.convertResumeToImageAndEmail = functions.https.onCall(async (data, context) => {
  // Verify admin authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { submissionId, recipientEmail } = data;

  if (!submissionId || !recipientEmail) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'submissionId and recipientEmail are required'
    );
  }

  try {
    // Get submission data from Firestore
    const submissionDoc = await admin
      .firestore()
      .doc(`artifacts/${APP_ID}/public/data/submissions/${submissionId}`)
      .get();

    if (!submissionDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Submission not found');
    }

    const submissionData = submissionDoc.data();

    // Generate HTML for resume
    const resumeHTML = generateResumeHTML(submissionData);

    // Launch headless browser and take screenshot
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(resumeHTML, { waitUntil: 'networkidle0' });
    await page.setViewport({ width: 1200, height: 1600 });

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true
    });

    await browser.close();

    // Configure email transporter
    // Note: You'll need to configure your email service (Gmail, SendGrid, etc.)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Change to your email service
      auth: {
        user: functions.config().email?.user || process.env.EMAIL_USER,
        pass: functions.config().email?.password || process.env.EMAIL_PASSWORD
      }
    });

    // Send email with attachment
    const mailOptions = {
      from: functions.config().email?.user || process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Resume Submission - ${submissionData.fullName || 'Resume'}`,
      html: `
        <h2>Resume Submission</h2>
        <p>Please find the attached resume image.</p>
        <p><strong>Name:</strong> ${submissionData.fullName || 'N/A'}</p>
        <p><strong>Email:</strong> ${submissionData.email || 'N/A'}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
      attachments: [
        {
          filename: `resume-${submissionId}.png`,
          content: screenshot
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Update submission status
    await admin
      .firestore()
      .doc(`artifacts/${APP_ID}/public/data/submissions/${submissionId}`)
      .update({
        status: 'processed',
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    return { success: true, message: 'Resume converted and emailed successfully' };
  } catch (error) {
    console.error('Error in convertResumeToImageAndEmail:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Generate HTML template for resume
 */
function generateResumeHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 40px;
          background: #fff;
        }
        .header {
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 36px;
          color: #1e40af;
          margin-bottom: 10px;
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          font-size: 14px;
          color: #666;
        }
        .section {
          margin-bottom: 30px;
        }
        .section h2 {
          font-size: 24px;
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .experience-item, .education-item {
          margin-bottom: 20px;
          padding-left: 15px;
          border-left: 3px solid #e5e7eb;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .item-title {
          font-weight: bold;
          font-size: 18px;
          color: #1e40af;
        }
        .item-date {
          color: #666;
          font-size: 14px;
        }
        .item-company {
          color: #666;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .item-description {
          color: #555;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-tag {
          background: #dbeafe;
          color: #1e40af;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 14px;
        }
        .summary {
          color: #555;
          line-height: 1.8;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.fullName || 'Resume'}</h1>
        <div class="contact-info">
          ${data.email ? `<span>📧 ${data.email}</span>` : ''}
          ${data.phone ? `<span>📱 ${data.phone}</span>` : ''}
          ${data.address ? `<span>📍 ${data.address}</span>` : ''}
          ${data.linkedin ? `<span>🔗 <a href="${data.linkedin}">LinkedIn</a></span>` : ''}
          ${data.website ? `<span>🌐 <a href="${data.website}">Website</a></span>` : ''}
        </div>
      </div>

      ${data.summary ? `
        <div class="section">
          <h2>Professional Summary</h2>
          <div class="summary">${data.summary}</div>
        </div>
      ` : ''}

      ${data.experiences && data.experiences.length > 0 ? `
        <div class="section">
          <h2>Work Experience</h2>
          ${data.experiences.map(exp => `
            <div class="experience-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.jobTitle || 'N/A'}</div>
                  <div class="item-company">${exp.company || 'N/A'}</div>
                </div>
                <div class="item-date">
                  ${exp.startDate || 'N/A'} - ${exp.current ? 'Present' : (exp.endDate || 'N/A')}
                </div>
              </div>
              ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.educations && data.educations.length > 0 ? `
        <div class="section">
          <h2>Education</h2>
          ${data.educations.map(edu => `
            <div class="education-item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree || 'N/A'}</div>
                  <div class="item-company">${edu.institution || 'N/A'}</div>
                </div>
                <div class="item-date">
                  ${edu.startDate || ''} ${edu.endDate ? `- ${edu.endDate}` : ''}
                </div>
              </div>
              ${edu.gpa ? `<div class="item-description">GPA: ${edu.gpa}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills && data.skills.length > 0 ? `
        <div class="section">
          <h2>Skills</h2>
          <div class="skills">
            ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
}

