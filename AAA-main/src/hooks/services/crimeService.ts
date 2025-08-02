async function coordsToCity(lat: number, lon: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(url, { headers: { "User-Agent": "crime-data-app" } });
    const data = await res.json();

    const address = data.address || {};
    const cityName =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      null;

    console.log("🗺 Detected city:", cityName);
    return cityName;
  } catch (err) {
    console.error("Error in reverse geocoding:", err);
    return null;
  }
}

export async function getCrimeNewsByCoords(lat: number, lon: number) {
  const GNEWS_KEY = "2be38beb55c2085bbc8cec2c1b1176c8";
  let city = await coordsToCity(lat, lon);

  // If no city found or no results for Centurion, fallback to Pretoria
  if (!city || /centurion/i.test(city)) {
    console.log("⚠️ Using Pretoria as fallback for crime search");
    city = "Pretoria";
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=crime+${encodeURIComponent(city)}&lang=en&token=${GNEWS_KEY}`;
    console.log("🔍 Searching crime news for:", city);
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      console.log(`ℹ️ No crime articles found for ${city}`);
      return { error: `No crime news found for ${city}` };
    }

    const incidents = data.articles.map((article: any) => {
      const headline = article.title || "";
      const description = article.description || "";
      const link = article.url || "";

      const tags: string[] = [];
      if (/murder|homicide/i.test(headline)) tags.push("Murder");
      if (/robbery|armed/i.test(headline)) tags.push("Armed Robbery");
      if (/theft|burglary|break-in/i.test(headline)) tags.push("Burglary");
      if (/assault|attack/i.test(headline)) tags.push("Assault");

      return {
        headline,
        description,
        tags: tags.length ? tags : ["Other"],
        link
      };
    });

    return {
      location: city,
      coordinates: { lat, lon },
      incidents
    };
  } catch (err: any) {
    console.error("Error fetching crime news:", err);
    return { error: err.message };
  }
}
