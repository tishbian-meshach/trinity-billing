'use server';

export async function sendWhatsApp(number: string, message: string) {
  const token = process.env.WASENDER_TOKEN;

  if (!token) {
    throw new Error('WASENDER_TOKEN is not configured');
  }

  // Format the number: ensure it starts with +
  const formattedNumber = number.startsWith('+') ? number : `+91${number}`;

  const response = await fetch('https://wasenderapi.com/api/send-message', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: formattedNumber,
      text: message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WhatsApp message failed: ${errorText}`);
  }

  return await response.json();
}
