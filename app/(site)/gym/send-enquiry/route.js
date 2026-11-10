import { readForm, flashRedirect } from '@/lib/http';
import { setFormData } from '@/lib/flash';
import { sendMail, EMAIL_FROM, escapeHtml } from '@/lib/email';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STYLE = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .header { background: #c19b76; color: white; padding: 20px; text-align: center; }
  .content { padding: 20px; }
  .details { background: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #c19b76; }
  .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }`;
const FOOTER = `
  <div class="footer">
    <p>Full Moon Hotels | Housing Area C, New Owerri | +234 (0) 812 313 9279</p>
    <p>Email: reservations@fullmoon-hotels.com | Website: https://fullmoon.found.ng</p>`;

export async function POST(request) {
  const body = await readForm(request);
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const subject = (body.subject || '').trim();
  const message = (body.message || '').trim();

  if (!name || !email || !message) {
    await setFormData({ name, email, message });
    return flashRedirect(request, '/gym', 'error', 'Please fill in all required fields (Name, Email, and Message).');
  }
  if (!EMAIL_RE.test(email)) {
    await setFormData({ name, email, message });
    return flashRedirect(request, '/gym', 'error', 'Please enter a valid email address.');
  }

  const e = escapeHtml;
  const when = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const subj = subject || 'Gym Membership Enquiry';

  try {
    await sendMail({
      from: `"Gym Enquiry" <${EMAIL_FROM}>`,
      replyTo: email,
      to: process.env.GYM_ENQUIRY_EMAIL || 'reservations@fullmoon-hotels.com',
      subject: `Gym Enquiry: ${subject || 'Membership Information'}`,
      html: `<!DOCTYPE html><html><head><style>${STYLE}</style></head><body>
        <div class="header"><h1>Full Moon Hotels - Gym Enquiry</h1><p>Fitness Centre Membership & Training Information Request</p></div>
        <div class="content">
          <div class="details"><h3>Enquiry Details</h3>
            <p><strong>From:</strong> ${e(name)}</p><p><strong>Email:</strong> ${e(email)}</p>
            <p><strong>Subject:</strong> ${e(subj)}</p><p><strong>Enquiry Date:</strong> ${when}</p></div>
          <div class="details"><h3>Message</h3><p>${e(message).replace(/\n/g, '<br>')}</p></div>
          <div class="details"><h3>Contact Information</h3><p><strong>Guest Email:</strong> ${e(email)}</p>
            <p><strong>Preferred Contact:</strong> Email</p><p><strong>Enquiry Type:</strong> Fitness Centre Services</p></div>
        </div>
        ${FOOTER}<p>This enquiry was submitted through the gym page contact form.</p></div>
      </body></html>`,
    });
    await sendMail({
      from: `"Full Moon Hotels Fitness Centre" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Thank You for Your Gym Enquiry - Full Moon Hotels',
      html: `<!DOCTYPE html><html><head><style>${STYLE}</style></head><body>
        <div class="header"><h1>Full Moon Hotels</h1><p>Fitness Centre - Thank You for Your Enquiry</p></div>
        <div class="content">
          <p>Dear ${e(name)},</p>
          <p>Thank you for your interest in the Full Moon Hotels Fitness Centre. We have received your enquiry and our team will get back to you within 24 hours.</p>
          <div class="details"><h3>Your Enquiry Summary</h3><p><strong>Subject:</strong> ${e(subj)}</p>
            <p><strong>Message:</strong> ${e(message)}</p><p><strong>Submitted:</strong> ${when}</p></div>
          <div class="details"><h3>What Happens Next?</h3>
            <p>• Our fitness centre manager will review your enquiry</p>
            <p>• You'll receive a detailed response within 24 hours</p>
            <p>• We'll provide information about membership options, personal training, and facility features</p></div>
          <div class="details"><h3>Immediate Assistance</h3>
            <p>If you need immediate assistance, please contact our fitness centre directly:</p>
            <p><strong>Phone:</strong> +234 (0) 812 313 9279</p><p><strong>Email:</strong> reservations@fullmoon-hotels.com</p>
            <p><strong>Operating Hours:</strong> Daily 6:00 AM - 10:00 PM</p></div>
          <p>We look forward to helping you achieve your fitness goals at Full Moon Hotels!</p>
          <p>Best regards,<br><strong>Fitness Centre Team</strong><br>Full Moon Hotels Owerri</p>
        </div>
        ${FOOTER}</div>
      </body></html>`,
    });
    return flashRedirect(
      request,
      '/gym',
      'success',
      'Thank you for your enquiry! We have received your message and will get back to you within 24 hours. A confirmation email has been sent to your inbox.'
    );
  } catch (error) {
    console.error('Error processing gym enquiry:', error);
    await setFormData({ name, email, message });
    return flashRedirect(
      request,
      '/gym',
      'error',
      'Sorry, there was an error sending your enquiry. Please try again or contact us directly at +234 (0) 812 313 9279.'
    );
  }
}
