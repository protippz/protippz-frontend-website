import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  const API_KEY = process.env.NEXT_PUBLIC_ADDRESS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch locations' });
  }
}
