'use server';

import { createClient } from '@/lib/supabase/server';
import { EnquiryInsert } from '@/types';

// Helper function to escape HTML characters for email template safety
function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function submitEnquiry(data: EnquiryInsert) {
  try {
    // 1. Server-side Input Validation
    if (!data.customer_name || !data.customer_name.trim()) {
      return { success: false, error: 'Customer name is required.' };
    }
    if (!data.email || !data.email.trim()) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!data.message || !data.message.trim()) {
      return { success: false, error: 'Specifications / Enquiry message is required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // 2. Supabase DB Insertion
    const supabase = (await createClient()) as unknown as {
      from: (table: string) => {
        insert: (data: unknown[]) => Promise<{ error: { message: string } | null }>
      }
    };
    const { error } = await supabase
      .from('enquiries')
      .insert([
        {
          customer_name: data.customer_name.trim(),
          phone: data.phone?.trim() || null,
          email: data.email.trim(),
          company: data.company?.trim() || null,
          message: data.message.trim(),
          status: 'new',
        },
      ]);

    if (error) {
      return { success: false, error: error.message };
    }

    // 3. Brevo Transactional Email Sending
    // Retrieve API key securely on the server
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error('Server Configuration Error: BREVO_API_KEY environment variable is not defined.');
    } else {
      try {
        // Sanitize all customer-controlled inputs before htmlContent interpolation
        const escapedName = escapeHtml(data.customer_name);
        const escapedEmail = escapeHtml(data.email);
        const escapedPhone = escapeHtml(data.phone);
        const escapedCompany = escapeHtml(data.company);
        const escapedMessage = escapeHtml(data.message);
        
        // Format timestamp
        const formattedDate = new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'long',
          timeStyle: 'medium',
        });

        const brevoPayload = {
          sender: {
            name: 'Twinplast Polymers',
            email: 'twinplastpolymers@gmail.com',
          },
          to: [
            {
              email: 'info@twinplastpolymers.com',
              name: 'Twinplast Polymers Info',
            },
          ],
          replyTo: {
            email: data.email.trim(),
            name: data.customer_name.trim(),
          },
          subject: `New B2B Enquiry from ${data.customer_name.trim()}`,
          htmlContent: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>New B2B Enquiry</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px 12px; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
      h2 { color: #1e3a8a; font-size: 1.5rem; margin-top: 0; margin-bottom: 24px; border-bottom: 2px solid #eff6ff; padding-bottom: 12px; font-weight: 700; }
      .grid { display: grid; gap: 16px; margin-bottom: 24px; }
      .field { border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
      .field:last-child { border-bottom: none; }
      .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #64748b; margin-bottom: 4px; }
      .value { font-size: 0.95rem; color: #0f172a; font-weight: 500; }
      .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; white-space: pre-wrap; font-family: inherit; font-size: 0.95rem; color: #334155; margin-top: 8px; }
      .footer { font-size: 0.8rem; color: #94a3b8; margin-top: 32px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>New B2B Website Enquiry</h2>
      <div class="grid">
        <div class="field">
          <div class="label">Customer Name</div>
          <div class="value">${escapedName}</div>
        </div>
        <div class="field">
          <div class="label">Company Name</div>
          <div class="value">${escapedCompany || '<em>Not Specified</em>'}</div>
        </div>
        <div class="field">
          <div class="label">Email Address</div>
          <div class="value"><a href="mailto:${escapedEmail}" style="color: #2563eb; text-decoration: none;">${escapedEmail}</a></div>
        </div>
        <div class="field">
          <div class="label">Phone Number</div>
          <div class="value">${escapedPhone || '<em>Not Specified</em>'}</div>
        </div>
        <div class="field">
          <div class="label">Submission Date & Time (IST)</div>
          <div class="value">${formattedDate}</div>
        </div>
      </div>
      <div class="label">Specifications / Enquiry Details</div>
      <div class="message-box">${escapedMessage}</div>
      <div class="footer">
        This notification was automatically sent from the Twinplast Polymers website.
      </div>
    </div>
  </body>
</html>
          `,
        };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify(brevoPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Brevo Email Send Failure: HTTP status ${response.status}. Details:`, errorText);
        } else {
          console.log('Brevo transactional email sent successfully.');
        }
      } catch (emailErr) {
        console.error('Exception occurred while calling Brevo API:', emailErr);
      }
    }

  return { success: true };
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown Server Error';
  return { success: false, error: errorMessage };
}
}
