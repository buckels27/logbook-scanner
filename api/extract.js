export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured - add ANTHROPIC_API_KEY to Vercel environment variables' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Extract JSON from Claude's response (it sometimes adds text around the JSON)
    const responseText = data.content?.[0]?.text || '';
    
    // Try to find JSON array in the response
    const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (jsonMatch) {
      // Return cleaned response with just the JSON
      return res.status(200).json({
        content: [{
          type: 'text',
          text: jsonMatch[0]
        }]
      });
    }
    
    // No JSON found - return original (will cause error on client, but with better info)
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to process request: ' + error.message });
  }
}
