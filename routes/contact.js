const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// GET /contact - Contact page
router.get('/', (req, res) => {
    // Get form data from session if it exists (for form repopulation)
    const formData = req.session.formData || null;
    
    // Clear the form data from session after using it
    if (req.session.formData) {
        delete req.session.formData;
    }

    res.render('contact', {
        title: 'Contact Us - Full Moon Hotels Owerri',
        description: 'Get in touch with Full Moon Hotels Owerri. Luxury accommodation with premium amenities and exceptional service. Call 0903 886 9936 or send us a message.',
        user: req.user,
        formData: formData // Pass formData to the template
    });
});

// POST /contact/send - Send contact form
router.post('/send', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            req.flash('error', 'Please fill in all required fields');
            req.session.formData = req.body; // Store form data for repopulation
            return res.redirect('/contact');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', 'Please enter a valid email address');
            req.session.formData = req.body; // Store form data for repopulation
            return res.redirect('/contact');
        }

        // Create email transporter (using console log for development)
        if (process.env.NODE_ENV === 'production') {
            // For production - configure with real email service
            const transporter = nodemailer.createTransporter({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'your-email@gmail.com',
                    pass: process.env.EMAIL_PASS || 'your-app-password'
                }
            });

            // Email content for admin
            const adminMailOptions = {
                from: email,
                to: process.env.CONTACT_EMAIL || 'info@fullmoon-hotels.com',
                subject: `New Contact Form: ${subject}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #c19b76;">New Contact Form Submission</h2>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <p><strong>Name:</strong> ${name}</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Subject:</strong> ${subject}</p>
                            <p><strong>Message:</strong></p>
                            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #c19b76;">
                                ${message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        <p style="margin-top: 20px; color: #666;">
                            This message was sent from the contact form on Full Moon Hotels website.
                        </p>
                    </div>
                `
            };

            // Auto-reply to user
            const userMailOptions = {
                from: process.env.CONTACT_EMAIL || 'info@fullmoon-hotels.com',
                to: email,
                subject: 'Thank you for contacting Full Moon Hotels',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #c19b76;">Thank you for contacting us!</h2>
                        <p>Dear ${name},</p>
                        <p>We have received your message and our team will get back to you within 24 hours.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="color: #333; margin-top: 0;">Your Message:</h4>
                            <p><strong>Subject:</strong> ${subject}</p>
                            <p>${message.replace(/\n/g, '<br>')}</p>
                        </div>

                        <div style="border-top: 2px solid #c19b76; padding-top: 20px;">
                            <h4 style="color: #333;">Contact Information</h4>
                            <p><strong>Address:</strong><br>
                            Plot H-1 Fullmoon Avenue, Housing Area "C"<br>
                            New Owerri, Owerri 460721<br>
                            Imo State, Nigeria</p>
                            
                            <p><strong>Phone:</strong> 0903 886 9936</p>
                            <p><strong>Email:</strong> info@fullmoon-hotels.com</p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(adminMailOptions);
            await transporter.sendMail(userMailOptions);
        } else {
            // In development, just log the email content
            console.log('=== CONTACT FORM SUBMISSION ===');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Subject:', subject);
            console.log('Message:', message);
            console.log('===============================');
        }

        req.flash('success', 'Thank you for your message! We will get back to you within 24 hours.');
        res.redirect('/contact');

    } catch (error) {
        console.error('Contact form error:', error);
        
        // Store form data to repopulate form on error
        req.session.formData = req.body;
        
        req.flash('error', 'Sorry, there was an error sending your message. Please try again or call us directly.');
        res.redirect('/contact');
    }
});

module.exports = router;