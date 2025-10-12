import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EbookRequest {
  email: string
  name: string
  ebookType: string
}

serve(async (req) => {
  try {
    const { email, name, ebookType }: EbookRequest = await req.json()

    // Determine which eBook to send
    let subject = ''
    let pdfUrl = ''
    let ebookTitle = ''

    if (ebookType === 'free_stem_study_system') {
      subject = '🎉 Your FREE STEM Study System eBook is Here!'
      pdfUrl = 'https://raw.githubusercontent.com/STEMSphere/stemsphereacademy/main/assets/The%20STEM%20Student%27s%20Secret%20Study%20System%20(1).pdf'
      ebookTitle = 'The STEM Student\'s Secret Study System'
    } else if (ebookType === 'free_college_prep_secrets') {
      subject = '🎉 Your FREE College Prep Secrets eBook is Here!'
      pdfUrl = 'https://raw.githubusercontent.com/STEMSphere/stemsphereacademy/main/assets/College%20Prep%20Secrets.pdf'
      ebookTitle = 'College Prep Secrets for Parents'
    } else {
      throw new Error('Invalid eBook type')
    }

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'STEMSphere Academy <support@stemsphere.academy>',
        to: [email],
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0;
                background-color: #f4f4f4;
              }
              .container { 
                max-width: 600px; 
                margin: 20px auto; 
                background: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 40px 30px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content { 
                padding: 40px 30px;
                background: #ffffff;
              }
              .content p {
                margin: 15px 0;
                font-size: 16px;
              }
              .button { 
                display: inline-block; 
                background: #ff0000; 
                color: white !important; 
                padding: 16px 40px; 
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: bold; 
                margin: 25px 0;
                font-size: 18px;
                box-shadow: 0 4px 12px rgba(255,0,0,0.3);
              }
              .button:hover {
                background: #cc0000;
              }
              .button-container {
                text-align: center;
              }
              ul {
                padding-left: 20px;
                margin: 15px 0;
              }
              ul li {
                margin: 8px 0;
              }
              .footer { 
                text-align: center; 
                padding: 30px; 
                background: #f9f9f9;
                color: #666; 
                font-size: 14px;
                border-top: 1px solid #eeeeee;
              }
              .footer a {
                color: #667eea;
                text-decoration: none;
              }
              .divider {
                height: 1px;
                background: #eeeeee;
                margin: 30px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Your FREE eBook is Ready!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                
                <p>Thank you for downloading <strong>${ebookTitle}</strong>!</p>
                
                <p>This eBook contains proven strategies that have helped hundreds of students excel in STEM subjects and prepare for college success.</p>
                
                <div class="button-container">
                  <a href="${pdfUrl}" class="button">📥 Download Your eBook Now</a>
                </div>
                
                <div class="divider"></div>
                
                <p><strong>What's Inside:</strong></p>
                <ul>
                  <li>Actionable strategies you can implement immediately</li>
                  <li>Real-world examples from top students</li>
                  <li>Step-by-step systems that actually work</li>
                  <li>Bonus tips and resources</li>
                </ul>
                
                <div class="divider"></div>
                
                <p><strong>What's Next?</strong></p>
                <ul>
                  <li>📖 Read through the eBook at your own pace</li>
                  <li>✅ Implement the strategies right away</li>
                  <li>🎯 Track your progress and results</li>
                  <li>🚀 Need 1-on-1 help? <a href="https://learn.stemsphere.academy" style="color: #667eea; text-decoration: none; font-weight: bold;">Book a free tutoring session</a></li>
                </ul>
                
                <p>Questions? Just reply to this email - we're here to help!</p>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>The STEMSphere Team</strong></p>
              </div>
              <div class="footer">
                <p><strong>STEMSphere Academy</strong></p>
                <p><a href="https://learn.stemsphere.academy">learn.stemsphere.academy</a></p>
                <p style="margin-top: 15px; font-size: 12px; color: #999;">
                  © 2025 STEMSphere Academy. All rights reserved.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(data)}`)
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )
  }
})
