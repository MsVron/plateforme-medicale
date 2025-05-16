require('dotenv').config();
const nodemailer = require('nodemailer');

// Print all environment variables to troubleshoot
console.log('\n--- Environment Variables ---');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'MISSING');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'MISSING');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'MISSING (using default)');
console.log('------------------------------\n');

async function testGmail() {
  console.log('Testing Gmail configuration...');
  try {
    // Create a test transporter using Gmail SMTP
    const gmailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true
    });

    // Verify SMTP connection configuration
    console.log('Verifying Gmail SMTP connection...');
    await gmailTransporter.verify();
    console.log('Gmail SMTP server connection successful!');
    
    // Send test email via Gmail
    console.log('Sending test email via Gmail...');
    const info = await gmailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // sending to yourself for testing
      subject: 'Test Email from BluePulse via Gmail',
      text: 'This is a test email to verify your Gmail configuration. If you receive this, your Gmail settings are working!',
      html: '<h1>Gmail Test Successful!</h1><p>Your Gmail configuration is working.</p>'
    });

    console.log('Gmail test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Gmail test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Common problems and solutions
    if (error.code === 'EAUTH') {
      console.log('\n*** GMAIL AUTHENTICATION ERROR ***');
      console.log('This usually means your email/password is incorrect.');
      console.log('For Gmail, make sure you:');
      console.log('1. Are using an App Password, not your regular password');
      console.log('2. Have 2-factor authentication enabled on your Google account');
      console.log('3. Have created an App Password specifically for this application');
    }
  }
}

async function testEthereal() {
  console.log('\nFallback: Testing with Ethereal (fake SMTP service)...');
  try {
    // Create a test account on Ethereal
    console.log('Creating Ethereal test account...');
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test account created:', testAccount.user);
    
    // Create a transporter using Ethereal test account
    const etherealTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Send mail with Ethereal
    console.log('Sending test email via Ethereal...');
    const info = await etherealTransporter.sendMail({
      from: '"BluePulse Test" <test@example.com>',
      to: 'recipient@example.com',
      subject: 'Test Email from BluePulse via Ethereal',
      text: 'This is a test email using Ethereal.',
      html: '<h1>Ethereal Test Email</h1><p>This is a test using Ethereal temporary email.</p>'
    });
    
    console.log('Ethereal test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Generate and print preview URL (works only with Ethereal accounts)
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('\nOpen the above URL in your browser to view the test email.');
    console.log('This proves that your nodemailer configuration is working correctly.');
    console.log('Try updating your Gmail app password or using a different email service.');
  } catch (error) {
    console.error('Ethereal test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

async function runTests() {
  try {
    // First try with Gmail (the actual configuration)
    await testGmail();
  } catch (error) {
    console.error('Unexpected error during Gmail test:', error);
  }
  
  // Always test with Ethereal as a fallback
  await testEthereal();
}

// Run all tests
runTests().catch(console.error); 