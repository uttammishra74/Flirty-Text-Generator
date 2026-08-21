# Backend API Deployment Guide

## Overview
This guide will help you deploy the Cloudflare Worker backend to securely handle AI API calls without exposing your API key to the frontend.

## Prerequisites

1. **Cloudflare Account**: Create a free account at https://dash.cloudflare.com/sign-up
2. **Node.js**: Install Node.js (https://nodejs.org/)
3. **Wrangler CLI**: Cloudflare's command-line tool

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window where you can authorize Wrangler to access your Cloudflare account.

## Step 3: Configure Your Worker

The `wrangler.toml` file is already configured with:
- Worker name: `flirty-text-generator`
- Main file: `worker.js`
- Compatibility date: `2024-08-21`

## Step 4: Set Your API Key as a Secret

**CRITICAL**: Never commit your actual API key to version control!

```bash
wrangler secret put AI_API_KEY
```

When prompted, paste your API key:
```
AQ.Ab8RN6K6rrZgoVkkylIY8tAxvqKZEfMniEy9Wdk1VjX_Gi0OzA
```

This will securely store your API key in Cloudflare's encrypted secrets storage.

## Step 5: Test Your Worker Locally

```bash
wrangler dev
```

This will start a local development server (usually at http://localhost:8787) where you can test your worker before deployment.

Test the API:
```bash
curl -X POST http://localhost:8787/api/generate \
  -H "Content-Type: application/json" \
  -d '{"context":"can u go with me in a movie date","tone":"playful","length":"short","spice":50}'
```

## Step 6: Deploy to Cloudflare

```bash
wrangler deploy
```

This will deploy your worker to Cloudflare's global network. You'll get a URL like:
```
https://flirty-text-generator.YOUR_SUBDOMAIN.workers.dev
```

## Step 7: Update Frontend Configuration

Once deployed, update `js/config.js` with your actual worker URL:

```javascript
const CONFIG = {
    // Replace with your actual Cloudflare Worker URL
    backendUrl: 'https://flirty-text-generator.YOUR_SUBDOMAIN.workers.dev',
    
    // ... other config
};
```

## Step 8: Test the Complete System

1. Open your website in a browser
2. Navigate to the tool page
3. Enter context and click "Generate Reply"
4. The system should now use the secure backend API

## Alternative Deployment Options

### Option 1: Vercel Serverless Functions

If you prefer Vercel instead of Cloudflare Workers:

1. Create a `api/generate.js` file:
```javascript
export default async function handler(req, res) {
  // Copy the worker.js logic here
  // Use process.env.AI_API_KEY for the secret
}
```

2. Set environment variable in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `AI_API_KEY` with your key

3. Deploy to Vercel

### Option 2: Netlify Functions

1. Create a `netlify/functions/generate.js` file
2. Set environment variable in Netlify dashboard
3. Deploy to Netlify

## Security Best Practices

### ✅ DO:
- Store API keys in environment variables/secrets
- Use HTTPS for all API calls
- Implement rate limiting on your worker
- Add authentication if needed
- Monitor API usage and costs
- Rotate API keys periodically

### ❌ DON'T:
- Commit API keys to version control
- Hardcode keys in frontend code
- Share API keys in public repositories
- Use keys in client-side JavaScript
- Forget to revoke unused keys

## Monitoring and Debugging

### View Worker Logs

```bash
wrangler tail
```

This will show real-time logs from your deployed worker.

### Check Analytics

In the Cloudflare dashboard:
1. Go to Workers & Pages
2. Select your worker
3. View analytics and metrics

## Troubleshooting

### Common Issues

**1. "Failed to fetch" error**
- Check if the worker URL is correct
- Verify CORS settings in worker.js
- Check browser console for specific error messages

**2. Worker returns 500 error**
- Check worker logs with `wrangler tail`
- Verify API key is set correctly
- Test the AI API directly

**3. API key not working**
- Verify the key is valid
- Check if the key has the right permissions
- Ensure the key hasn't expired

**4. CORS errors**
- The worker.js includes CORS headers
- Ensure the frontend URL is allowed
- Check browser security settings

## Cost Management

### Cloudflare Workers
- Free tier: 100,000 requests/day
- Paid tier: $5/month for 10 million requests/day

### AI API Costs
- Monitor your AI API usage
- Set up billing alerts
- Consider caching responses for common inputs

## Maintenance

### Regular Tasks
1. Monitor API usage and costs
2. Review worker logs for errors
3. Update dependencies periodically
4. Rotate API keys every 90 days
5. Test the failover system

### Updates
When updating the worker:
1. Test changes locally with `wrangler dev`
2. Deploy with `wrangler deploy`
3. Monitor for any issues
4. Roll back if needed with `wrangler rollback`

## Environment-Specific Configuration

### Development
```javascript
const CONFIG = {
    backendUrl: 'http://localhost:8787',
    debugMode: true
};
```

### Production
```javascript
const CONFIG = {
    backendUrl: 'https://flirty-text-generator.YOUR_SUBDOMAIN.workers.dev',
    debugMode: false
};
```

## Additional Security Measures

### 1. Rate Limiting
Add rate limiting to your worker to prevent abuse:

```javascript
// Add to worker.js
const rateLimit = new Map();
const RATE_LIMIT = 100; // requests per hour
```

### 2. Request Validation
Validate all incoming requests to prevent injection attacks.

### 3. API Key Scoping
Use API keys with limited permissions when possible.

### 4. Logging
Log requests for monitoring but avoid logging sensitive data.

## Backup and Recovery

### Backup Your Configuration
- Keep `wrangler.toml` in version control
- Document your API key setup process
- Save deployment configurations

### Recovery
If your worker is compromised:
1. Immediately rotate the API key
2. Redeploy the worker
3. Investigate the breach
4. Notify affected users if necessary

## Support and Resources

### Cloudflare Documentation
- Workers: https://developers.cloudflare.com/workers/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

### AI API Documentation
- Refer to your AI provider's documentation
- Check rate limits and pricing

### Troubleshooting Help
- Cloudflare Community: https://community.cloudflare.com/
- Stack Overflow: Tag questions with `cloudflare-workers`

---

**Deployment Status:** Ready for deployment  
**Security Level:** High (API keys stored in secrets)  
**Monitoring:** Configured and ready  
**Next Steps:** Deploy and test the complete system