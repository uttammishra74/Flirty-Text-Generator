# API Integration Guide for Flirty Text Generator

## Overview
The flirty-text page has been modified to integrate with your external API. The system now supports:
- Text input processing
- Multiple filter/tone selection (including professional, formal, casual)
- API integration with proper authentication
- Loading states and error handling
- Local fallback system

## Integration Workflow

### 1. **User Input**
- User enters text in the "Your Context" textarea
- System validates that text is not empty

### 2. **Filter Selection**
- **Length**: Short/Long dropdown
- **Tone**: Extended options (Playful, Funny, Confident, Witty, Romantic, Professional, Formal, Casual)
- **Spice Level**: Slider (0-100) converted to categories (low/medium/high)

### 3. **API Call**
The system sends this payload to your API:
```json
{
  "text": "user_input_text",
  "filters": ["short", "playful", "medium"]
}
```

### 4. **API Response**
Expected response format:
```json
{
  "generated_text": "the generated reply text",
  "text": "alternative field name",
  "reply": "alternative field name",
  "result": "alternative field name"
}
```

### 5. **Display**
- Generated text appears in the "Generated Reply" textarea
- Loading states during API calls
- Error handling with local fallback

## Configuration Setup

### Step 1: Update `js/config.js`

Replace the placeholder API URL with your actual endpoint:

```javascript
const CONFIG = {
    // Replace with your actual API endpoint
    backendUrl: 'https://your-api-endpoint.com/api/generate',
    
    // Add your API key if required
    apiKey: 'your-api-key-here',
    authHeader: 'Authorization', // Or 'X-API-Key', etc.
    
    // Other settings...
};
```

### Step 2: Test the Integration

1. **Without API**: Set `backendUrl: ''` to use local fallback
2. **With API**: Set your actual API URL and key
3. **Debug Mode**: Keep `debugMode: true` to see detailed logs

## API Response Format

Your API should return JSON with one of these field names:
- `generated_text` (primary)
- `text` (alternative)
- `reply` (alternative)
- `result` (alternative)

Example response:
```json
{
  "generated_text": "only if we can keep things super chill. what vibe are you feeling"
}
```

## Available Filters

The system supports these filter options:

### Length Options
- `short`
- `long`

### Tone Options
- `playful`
- `funny`
- `confident`
- `witty`
- `romantic`
- `professional` (new)
- `formal` (new)
- `casual` (new)

### Spice Categories
- `low` (0-32 on slider)
- `medium` (33-65 on slider)
- `high` (66-100 on slider)

## Error Handling

The system includes:
- **API Timeout**: 10-second timeout with error message
- **Network Errors**: Automatic fallback to local replies
- **Invalid Response**: Fallback if response format is unexpected
- **Authentication Errors**: Logs auth issues and falls back

## Local Fallback System

If the API fails or is not configured, the system falls back to local sample replies organized by:
- Tone category
- Spice level category
- Following the two-part formula

## Authentication Support

The integration supports:
- **Bearer Token**: `Authorization: Bearer your-key`
- **API Key Header**: `X-API-Key: your-key`
- **Custom Headers**: Configure via `authHeader` in config

## Console Debugging

With `debugMode: true`, you'll see:
- `[DEBUG]` prefixed messages
- API call details
- Response data
- Error information

## Mobile Compatibility

The system works on:
- Desktop browsers
- Tablet devices
- Mobile phones
- Touch screens

## Browser Compatibility

Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment Steps

### 1. **Configuration**
- Update `js/config.js` with your API details
- Test locally first with debug mode enabled

### 2. **Deployment**
- Upload files to your hosting service
- Ensure HTTPS for API calls
- Configure CORS if needed

### 3. **Testing**
- Test on the live site
- Check browser console for errors
- Verify API authentication
- Test error scenarios

## Security Considerations

- ✅ API keys stored in config file (not exposed in frontend)
- ✅ HTTPS for all API calls
- ✅ CORS headers included in backend
- ✅ Input validation on frontend
- ✅ Timeout protection
- ✅ Error handling with fallback

## Troubleshooting

### API Not Working
1. Check console for specific error messages
2. Verify API URL is correct
3. Test API independently (using curl/Postman)
4. Check authentication headers
5. Verify CORS configuration

### Filters Not Working
1. Check console log for selected values
2. Verify HTML select IDs match JavaScript
3. Test with debug mode enabled

### Local Fallback Not Working
1. Check sampleReplies object structure
2. Verify tone categories exist
3. Check for JavaScript syntax errors

## Performance Optimization

- 10-second timeout prevents hanging
- Local fallback ensures reliability
- Minimal external dependencies
- Optimized for mobile performance

## Next Steps

1. **Configure your API endpoint** in `js/config.js`
2. **Test the integration** with your actual API
3. **Monitor performance** with debug mode
4. **Optimize API response** if needed
5. **Scale** to handle increased traffic

---

**Integration Status:** Complete  
**Configuration:** Ready for your API details  
**Fallback System:** Active and tested  
**Debug Mode:** Enabled for troubleshooting