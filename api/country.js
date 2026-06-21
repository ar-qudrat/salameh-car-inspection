// Vercel Serverless Function to retrieve the visitor country code using Vercel IP headers
export default function handler(req, res) {
  // Extract structural IP country from Vercel headers, default to SA for safety
  const country = req.headers['x-vercel-ip-country'] || 'SA';
  
  // Set minimal caching to optimize performance without sacrificing precision
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  
  res.status(200).json({ 
    country: country.toUpperCase()
  });
}
