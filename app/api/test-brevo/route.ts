import { NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';

export async function GET() {
  try {
    // Initialize Brevo API client
    const apiInstance = new brevo.TransactionalEmailsApi();
    const apiKey = brevo.TransactionalEmailsApiApiKeys.apiKey;
    apiInstance.setApiKey(apiKey, process.env.BREVO_API_KEY || '');

    // Test API call - get account info
    const accountApi = new brevo.AccountApi();
    const accountApiKey = brevo.AccountApiApiKeys.apiKey;
    accountApi.setApiKey(accountApiKey, process.env.BREVO_API_KEY || '');

    const accountInfo = await accountApi.getAccount();

    return NextResponse.json({
      success: true,
      message: 'Brevo API key is valid',
      accountInfo: {
        email: accountInfo.body.email,
        companyName: accountInfo.body.companyName,
        plan: accountInfo.body.plan,
      },
    });
  } catch (error) {
    console.error('Brevo API test error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      },
      { status: 500 }
    );
  }
}
