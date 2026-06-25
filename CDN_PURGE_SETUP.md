# CDN Purge Setup Guide

## Overview

This project now automatically purges the Vercel CDN cache when content is created or updated. This ensures that users see fresh content immediately without manual intervention.

## How It Works

When you create, update, or delete any of the following content types, the CDN cache is automatically purged:

- **News Articles** - Main articles, gallery images, documents
- **Teams** - Team information, coach details, images
- **Tags** - Category tags
- **Board Members** (Vorstand)
- **Honorary Members** (Ehrenmitglieder)
- **Hero Images**
- **Important Dates**

## Environment Setup

To enable automatic CDN purging in production, you need to configure the following environment variable in your Vercel project:

### Required Environment Variable

```
VERCEL_TOKEN=<your-vercel-api-token>
```

### How to Get a Vercel API Token

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a descriptive name like "CDN Purge API"
4. Select appropriate scopes (at minimum: `cache:purge`)
5. Copy the generated token

### How to Add the Environment Variable

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `VERCEL_TOKEN`
   - **Value**: `<your-vercel-api-token>`
   - **Environments**: Production (and optionally Preview if needed)
4. Save the changes
5. Redeploy your application for the changes to take effect

## Behavior

### Development Mode
- CDN purging is **disabled** in development mode
- Only Next.js ISR (Incremental Static Regeneration) is used locally
- This prevents unnecessary API calls during development

### Production Mode
- Both Next.js ISR and CDN purging are performed
- If `VERCEL_TOKEN` is not configured:
  - A warning is logged to the console
  - CDN purging is skipped
  - The application continues to work normally
  - Only Next.js ISR is used (24-hour cache)

## Testing

After deploying with the environment variable:

1. Create or edit a news article in the admin panel
2. Check the server logs for:
   ```
   [CDN Purge] Successfully purged CDN cache for tags: [....]
   ```
3. Visit the news page to confirm the changes are immediately visible

## Troubleshooting

### CDN Not Purging

If content updates are not immediately visible:

1. Check that `VERCEL_TOKEN` is set in your Vercel project settings
2. Check the server logs for CDN purge errors
3. Verify the API token has the correct scopes
4. Ensure the deployment has been redeployed after adding the environment variable

### Token Permission Issues

If you see errors like "403 Forbidden":
- The API token might not have sufficient permissions
- Create a new token with `cache:purge` scope

## Implementation Details

The CDN purging functionality is implemented in:

- `/lib/cache/cdn-purge.ts` - Core CDN purging logic
- `/lib/cache/revalidate.ts` - Integration with Next.js cache revalidation

All API endpoints that modify content automatically call the appropriate revalidation functions, which handle both Next.js ISR and CDN purging.
