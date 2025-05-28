const API_URL = 'https://api.promptjoy.com/api/jQGCwq';
const API_KEY = 'sk-17c4f2e94891fae6423fde005b9064d74372a564';

export async function getGiftRecommendation(interest, budget = '$20') {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ interest, budget })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch gift recommendation');
    }

    return await response.json(); // { gift: "...", "price range": "..." }
  } catch (error) {
    console.error('Error fetching gift recommendation:', error);
    return null;
  }
}
