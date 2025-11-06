# User Guide - Resume Builder PWA

## For Resume Submitters

### Getting Started

1. **Visit the Application**
   - Open the Resume Builder in your web browser
   - No account creation required!

2. **Fill Out Your Resume**
   - The form is divided into 4 easy steps
   - Progress is saved as you go through each step
   - You can go back to previous steps to make changes

### Step-by-Step Instructions

#### Step 1: Personal Information

Fill in your basic details:
- **Full Name** (Required) - Your complete name
- **Email** (Required) - Your email address
- **Phone** (Optional) - Your contact number
- **Address** (Optional) - Your location
- **LinkedIn** (Optional) - Your LinkedIn profile URL
- **Website** (Optional) - Your personal website or portfolio

**Tips:**
- Make sure your email is correct - this is how you'll be contacted
- Include LinkedIn if you have one - it adds credibility
- Click "Next" when done

#### Step 2: Work Experience

Add your professional experience:
- Click "Add Another Experience" to add multiple jobs
- For each experience, provide:
  - **Job Title** (Required) - e.g., "Software Engineer"
  - **Company** (Required) - Company name
  - **Start Date** (Required) - When you started
  - **End Date** (Optional) - When you left (or leave blank if current)
  - **Currently working here** - Check this if it's your current job
  - **Description** (Optional) - Your responsibilities and achievements

**Tips:**
- Start with your most recent job
- Use bullet points in descriptions for clarity
- Highlight achievements, not just duties
- Click "Remove" to delete an experience entry

#### Step 3: Education

Add your educational background:
- Click "Add Another Education" for multiple entries
- For each education, provide:
  - **Degree/Certificate** (Required) - e.g., "Bachelor of Science in Computer Science"
  - **Institution** (Required) - School or university name
  - **Start Date** (Optional) - When you started
  - **End Date** (Optional) - Graduation date
  - **GPA** (Optional) - Your grade point average

**Tips:**
- List your highest degree first
- Include relevant certifications
- Add GPA only if it's impressive (3.5+)

#### Step 4: Skills & Summary

Complete your resume:
- **Add Skills**: Type a skill and press Enter or click "Add"
  - Examples: JavaScript, React, Project Management, etc.
  - Skills appear as tags
  - Click the × to remove a skill
- **Professional Summary**: Write a brief overview of your background
  - 2-3 sentences highlighting your experience
  - Focus on key strengths and career goals

**Tips:**
- List technical and soft skills
- Be specific (e.g., "React" not just "JavaScript")
- Keep summary concise and impactful

### Submitting Your Resume

1. **Review Your Information**
   - Use "Previous" to go back and check each step
   - Make sure all required fields are filled

2. **Click "Submit Resume"**
   - The system will validate your information
   - If there are errors, you'll see a message
   - Fix any issues and try again

3. **Confirmation**
   - You'll see a success message
   - Your resume is now submitted!
   - The form will reset for a new submission

### Frequently Asked Questions

**Q: Do I need to create an account?**
A: No! The system uses anonymous authentication - no sign-up required.

**Q: Can I edit my submission after submitting?**
A: No, but you can submit a new resume with updated information.

**Q: How do I know my resume was submitted?**
A: You'll see a green success message after submission.

**Q: Can I submit multiple resumes?**
A: Yes! After submitting, the form resets and you can submit another.

**Q: What happens to my data?**
A: Your resume is stored securely in Firebase and is accessible only to authorized administrators.

**Q: Will I receive a copy of my resume?**
A: The admin will process your submission and may contact you via email.

### Troubleshooting

**Form won't submit:**
- Check that all required fields are filled
- Verify your email format is correct
- Make sure you have at least one experience and education entry

**Can't go to next step:**
- Review the validation messages
- Ensure required fields in the current step are completed

**Page not loading:**
- Check your internet connection
- Try refreshing the page
- Clear your browser cache if issues persist

---

## For Administrators

### Logging In

1. Navigate to `/admin/login`
2. Enter your admin email and password
3. Click "Login"
4. You'll be redirected to the dashboard

### Dashboard Overview

The dashboard shows all submitted resumes:
- **Desktop View**: Full table with all details
- **Mobile View**: Compact cards with key information
- **Real-time Updates**: New submissions appear automatically

### Viewing a Submission

1. Click "View" on any submission
2. See complete resume details:
   - Personal information
   - Professional summary
   - Work experience
   - Education
   - Skills

### Editing a Submission

1. Open a submission
2. Click "Edit" button
3. Modify any fields
4. Click "Save"
5. Changes are saved immediately

### Converting Resume to Image and Email

1. Open a submission
2. Click "Convert & Email"
3. Enter recipient email address
4. Click "Send Email"
5. The system will:
   - Generate an image of the resume
   - Send it as an email attachment
   - Update submission status to "processed"

### Deleting a Submission

1. Click "Delete" on a submission
2. Confirm deletion in the modal
3. Submission is permanently removed

### Logging Out

Click "Logout" in the top right corner to sign out.

---

## Browser Compatibility

- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## PWA Features

### Installing the App

1. Visit the application in your browser
2. Look for the "Install" prompt
3. Click "Install" to add to home screen
4. The app works like a native application

### Offline Support

- The app works offline after first visit
- Previously viewed data is cached
- New submissions require internet connection

---

For technical setup, see `SETUP.md`
For access flow details, see `ACCESS_FLOWS.md`

