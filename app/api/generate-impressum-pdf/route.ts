import { NextRequest, NextResponse } from 'next/server';
import { CLUB_CONFIG } from '@/lib/club-config';

export async function POST(request: NextRequest) {
  try {
    const { impressumHtml, datenschutzHtml } = await request.json();

    // Create a clean HTML document for PDF generation
    const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Impressum & Datenschutzerklärung - ${CLUB_CONFIG.fullName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #1e293b;
      background: #ffffff;
      padding: 20mm;
      max-width: 170mm;
    }
    
    h1, h2, h3 {
      color: #ef4444;
      margin-top: 1.5em;
      margin-bottom: 0.75em;
    }
    
    h1 {
      font-size: 24pt;
      border-bottom: 2px solid #ef4444;
      padding-bottom: 0.5em;
    }
    
    h2 {
      font-size: 18pt;
    }
    
    h3 {
      font-size: 14pt;
    }
    
    p {
      margin-bottom: 1em;
    }
    
    ul, ol {
      margin-left: 2em;
      margin-bottom: 1em;
    }
    
    li {
      margin-bottom: 0.5em;
    }
    
    .section {
      border: 1px solid #e5e7eb;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      background: #fafafa;
    }
    
    a {
      color: #ef4444;
      text-decoration: underline;
    }
    
    strong {
      font-weight: bold;
    }
    
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 30px 0;
    }
    
    .page-break {
      page-break-after: always;
    }
    
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  ${impressumHtml}
  <hr class="page-break" />
  ${datenschutzHtml}
</body>
</html>`;

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF content' },
      { status: 500 }
    );
  }
}
