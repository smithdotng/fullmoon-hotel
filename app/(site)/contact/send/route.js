import { readForm, flashRedirect } from '@/lib/http';
import { setFormData } from '@/lib/flash';
import { sendMail, EMAIL_FROM, isEmailConfigured, escapeHtml } from '@/lib/email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const body = await readForm(request);
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const subject = (body.subject || '').trim();
  const message = (body.message || '').trim();
  const keep = { name, email, subject, message };

  if (!name || !email || !subject || !message) {
    await setFormData(keep);
    return flashRedirect(request, '/contact', 'error', 'Please fill in all required fields');
  }
  if (!EMAIL_RE.test(email)) {
    await setFormData(keep);
    return flashRedirect(request, '/contact', 'error', 'Please enter a valid email address');
  }

  try {
    if (isEmailConfigured()) {
      const e = escapeHtml;
      const contactTo = process.env.CONTACT_EMAIL || 'info@fullmoon-hotels.com';
      await sendMail({
        // Must be our own mailbox: the mail server rejects mail "from" other domains
        from: `"Website Contact Form" <${EMAIL_FROM}>`,
        replyTo: email,
        to: contactTo,
        subject: `New Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c19b76;">New Contact Form Submission</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <p><strong>Name:</strong> ${e(name)}</p>
              <p><strong>Email:</strong> ${e(email)}</p>
              <p><strong>Subject:</strong> ${e(subject)}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #c19b76;">${e(message).replace(/\n/g, '<br>')}</div>
            </div>
            <p style="margin-top: 20px; color: #666;">This message was sent from the contact form on Full Moon Hotels website.</p>
          </div>`,
      });
      await sendMail({
        from: `"Full Moon Hotels" <${EMAIL_FROM}>`,
        replyTo: contactTo,
        to: email,
        subject: 'Thank you for contacting Full Moon Hotels',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c19b76;">Thank you for contacting us!</h2>
            <p>Dear ${e(name)},</p>
            <p>We have received your message and our team will get back to you within 24 hours.</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">Your Message:</h4>
              <p><strong>Subject:</strong> ${e(subject)}</p>
              <p>${e(message).replace(/\n/g, '<br>')}</p>
            </div>
            <div style="border-top: 2px solid #c19b76; padding-top: 20px;">
              <h4 style="color: #333;">Contact Information</h4>
              <p><strong>Address:</strong><br>Plot H-1 Fullmoon Avenue, Housing Area "C"<br>New Owerri, Owerri 460721<br>Imo State, Nigeria</p>
              <p><strong>Phone:</strong> 0903 886 9936</p>
              <p><strong>Email:</strong> info@fullmoon-hotels.com</p>
            </div>
          </div>`,
      });
    } else {
      console.log('=== CONTACT FORM SUBMISSION ===', keep);
    }
    return flashRedirect(request, '/contact', 'success', 'Thank you for your message! We will get back to you within 24 hours.');
  } catch (error) {
    console.error('Contact form error:', error);
    await setFormData(keep);
    return flashRedirect(request, '/contact', 'error', 'Sorry, there was an error sending your message. Please try again or call us directly.');
  }
}
