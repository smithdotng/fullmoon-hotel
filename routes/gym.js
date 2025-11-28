// routes/gym.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// GET /gym - Gym & Fitness Centre page
router.get('/', (req, res) => {
    res.render('gym', {
        title: 'Fitness Centre - Full Moon Hotels',
        description: 'State-of-the-art fitness centre at Full Moon Hotels Owerri. Modern equipment, personal training, and wellness services for hotel guests.',
        url: '/gym',
        user: req.user,
        messages: req.flash(),
        formData: {} // Initialize empty form data for GET requests
    });
});

// POST /gym/send-enquiry - Handle gym enquiry form submissions
router.post('/send-enquiry', async (req, res) => {
    try {
        console.log('=== GYM ENQUIRY FORM SUBMISSION ===');
        console.log('Request body:', req.body);

        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !message) {
            req.flash('error', 'Please fill in all required fields (Name, Email, and Message).');
            return res.redirect('/gym');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', 'Please enter a valid email address.');
            return res.redirect('/gym');
        }

        // Create email transporter
        const transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER || 'reservations@fullmoon-hotels.com',
                pass: process.env.EMAIL_PASS || 'your-email-password'
            }
        });

        // Email content for hotel management
        const managementEmail = {
            from: `"Gym Enquiry" <${process.env.EMAIL_USER || 'reservations@fullmoon-hotels.com'}>`,
            to: process.env.GYM_ENQUIRY_EMAIL || 'reservations@fullmoon-hotels.com',
            subject: `Gym Enquiry: ${subject || 'Membership Information'}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #c19b76; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #c19b76; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Full Moon Hotels - Gym Enquiry</h1>
        <p>Fitness Centre Membership & Training Information Request</p>
    </div>
    
    <div class="content">
        <div class="details">
            <h3>Enquiry Details</h3>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'Gym Membership Enquiry'}</p>
            <p><strong>Enquiry Date:</strong> ${new Date().toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>

        <div class="details">
            <h3>Message</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
        </div>

        <div class="details">
            <h3>Contact Information</h3>
            <p><strong>Guest Email:</strong> ${email}</p>
            <p><strong>Preferred Contact:</strong> Email</p>
            <p><strong>Enquiry Type:</strong> Fitness Centre Services</p>
        </div>
    </div>
    
    <div class="footer">
        <p>Full Moon Hotels | Housing Area C, New Owerri | +234 (0) 812 313 9279</p>
        <p>Email: reservations@fullmoon-hotels.com | Website: https://fullmoon.found.ng</p>
        <p>This enquiry was submitted through the gym page contact form.</p>
    </div>
</body>
</html>
            `
        };

        // Confirmation email for the guest
        const guestConfirmationEmail = {
            from: `"Full Moon Hotels Fitness Centre" <${process.env.EMAIL_USER || 'reservations@fullmoon-hotels.com'}>`,
            to: email,
            subject: 'Thank You for Your Gym Enquiry - Full Moon Hotels',
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #c19b76; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #c19b76; }
        .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Full Moon Hotels</h1>
        <p>Fitness Centre - Thank You for Your Enquiry</p>
    </div>
    
    <div class="content">
        <p>Dear ${name},</p>
        
        <p>Thank you for your interest in the Full Moon Hotels Fitness Centre. We have received your enquiry and our team will get back to you within 24 hours.</p>
        
        <div class="details">
            <h3>Your Enquiry Summary</h3>
            <p><strong>Subject:</strong> ${subject || 'Gym Membership Enquiry'}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })}</p>
        </div>

        <div class="details">
            <h3>What Happens Next?</h3>
            <p>• Our fitness centre manager will review your enquiry</p>
            <p>• You'll receive a detailed response within 24 hours</p>
            <p>• We'll provide information about membership options, personal training, and facility features</p>
        </div>

        <div class="details">
            <h3>Immediate Assistance</h3>
            <p>If you need immediate assistance, please contact our fitness centre directly:</p>
            <p><strong>Phone:</strong> +234 (0) 812 313 9279</p>
            <p><strong>Email:</strong> reservations@fullmoon-hotels.com</p>
            <p><strong>Operating Hours:</strong> Daily 6:00 AM - 10:00 PM</p>
        </div>

        <p>We look forward to helping you achieve your fitness goals at Full Moon Hotels!</p>
        
        <p>Best regards,<br>
        <strong>Fitness Centre Team</strong><br>
        Full Moon Hotels Owerri</p>
    </div>
    
    <div class="footer">
        <p>Full Moon Hotels | Housing Area C, New Owerri | +234 (0) 812 313 9279</p>
        <p>Email: reservations@fullmoon-hotels.com | Website: https://fullmoon.found.ng</p>
    </div>
</body>
</html>
            `
        };

        // Send emails
        await transporter.sendMail(managementEmail);
        console.log('Gym enquiry email sent to management');

        await transporter.sendMail(guestConfirmationEmail);
        console.log('Confirmation email sent to guest');

        // Store form data in session for potential redirect with form data
        req.session.formData = { name, email, message };
        
        req.flash('success', 'Thank you for your enquiry! We have received your message and will get back to you within 24 hours. A confirmation email has been sent to your inbox.');
        
        // Redirect back to gym page with success message
        res.redirect('/gym');

    } catch (error) {
        console.error('Error processing gym enquiry:', error);
        
        // Store form data to repopulate form on error
        req.session.formData = req.body;
        
        req.flash('error', 'Sorry, there was an error sending your enquiry. Please try again or contact us directly at +234 (0) 812 313 9279.');
        
        res.redirect('/gym');
    }
});

// Middleware to pass form data to all gym routes
router.use((req, res, next) => {
    if (req.session.formData) {
        res.locals.formData = req.session.formData;
        delete req.session.formData;
    } else {
        res.locals.formData = {};
    }
    next();
});

module.exports = router;