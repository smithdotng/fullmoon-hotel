import { readForm, flashRedirect } from '@/lib/http';
import { setFormData } from '@/lib/flash';
import { sendMail, EMAIL_FROM, isEmailConfigured, escapeHtml } from '@/lib/email';
import { verifyRecaptcha, clientIp } from '@/lib/recaptcha';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 200, subject: 200, message: 5000 };
const oneLine = (v) => String(v || '').replace(/[\r\n]+/g, ' ').trim();

const RECAPTCHA_MESSAGES = {
  missing: 'Please confirm you are not a robot and send your message again.',
  failed: 'We could not verify your message. Please try again, or call us directly.',
  error: 'Sorry, we could not verify your message right now. Please try again or call us directly.',
};

export async function POST(request) {
  const body = await readForm(request);
  const name = oneLine(body.name);
  const email = oneLine(body.email);
  const subject = oneLine(body.subject);
  const message = String(body.message || '').trim();
  const keep = { name, email, subject, message };

  // Honeypot filled in: almost certainly a bot. Pretend it worked and send nothing.
  if (body.website) {
    return flashRedirect(request, '/contact', 'success', 'Thank you for your message! We will get back to you within 24 hours.');
  }

  if (!name || !email || !subject || !message) {
    await setFormData(keep);
    return flashRedirect(request, '/contact', 'error', 'Please fill in all required fields');
  }
  if (!EMAIL_RE.test(email)) {
    await setFormData(keep);
    return flashRedirect(request, '/contact', 'error', 'Please enter a valid email address');
  }
  if (Object.entries(LIMITS).some(([field, max]) => keep[field].length > max)) {
    await setFormData(keep);
    return flashRedirect(request, '/contact', 'error', 'Your message is too long. Please shorten it and try again.');
  }

  const check = await verifyRecaptcha(body['g-recaptcha-response'], { action: 'contact', ip: clientIp(request) });
  if (!check.ok) {
    await setFormData(keep);
    return flashRedirect(request, '/contact', 'error', RECAPTCHA_MESSAGES[check.reason] || RECAPTCHA_MESSAGES.failed);
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
