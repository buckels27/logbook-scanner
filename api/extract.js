export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
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

    // Try to extract and validate JSON from the response
    // Claude sometimes adds text before/after the JSON array
    const responseText = data.content?.[0]?.text || '';
    
    // Find JSON array in the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      try {
        // Validate it's proper JSON
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Return a clean response with just the JSON
        return res.status(200).json({
          content: [{
            type: 'text',
            text: JSON.stringify(parsed)
          }]
        });
      } catch (parseErr) {
        // JSON found but invalid - return original for debugging
        return res.status(200).json(data);
      }
    }
    
    // No JSON array found - return original response
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to process request: ' + error.message });
  }
}

