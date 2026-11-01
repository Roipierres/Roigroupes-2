/**
 * Fetch the user's public IP address using ipify API
 */
export async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('IP fetch failed');
    const data = await response.json();
    return data.ip || '0.0.0.0';
  } catch (error) {
    console.error('Error fetching IP:', error);
    return '127.0.0.1'; // Fallback
  }
}
