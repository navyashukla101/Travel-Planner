const fetch = global.fetch || require("node-fetch");

// Fetch images from Unsplash API for a destination
async function fetchDestinationImages(query) {
  const unsplashKey = process.env.UNSPLASH_KEY;

  // Try Unsplash first if key is provided
  if (unsplashKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=5&order_by=relevant`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          source: "unsplash",
          images: data.results.map((photo) => ({
            url: photo.urls.regular,
            caption: photo.description || photo.alt_description || query,
            credit: `Photo by ${photo.user.name} on Unsplash`,
          })),
        };
      }
    } catch (err) {
      console.error("Unsplash API error:", err.message || err);
    }
  }

  // Fallback: use Pixabay API (free, no key required for basic usage)
  const pixabayKey = process.env.PIXABAY_KEY;
  if (pixabayKey) {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(
          query
        )}&image_type=photo&per_page=5&safesearch=true`
      );
      const data = await response.json();
      if (data.hits && data.hits.length > 0) {
        return {
          source: "pixabay",
          images: data.hits.map((photo) => ({
            url: photo.webformatURL,
            caption: `${query} - ${photo.user}`,
            credit: `Photo by ${photo.user} on Pixabay`,
          })),
        };
      }
    } catch (err) {
      console.error("Pixabay API error:", err.message || err);
    }
  }

  // Fallback: return placeholder images using public CDN URLs
  // Using direct image URLs from reliable sources instead of dynamic generation
  const placeholderImages = {
    paris:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
    london:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
    tokyo:
      "https://images.unsplash.com/photo-1540959375944-7049f642e9b5?w=800&h=600&fit=crop",
    "new york":
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
    barcelona:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop",
    rome: "https://images.unsplash.com/photo-1552832860-3f6a0a4f9e8a?w=800&h=600&fit=crop",
    dubai:
      "https://images.unsplash.com/photo-1512453213547-b1a4a5f9d8c9?w=800&h=600&fit=crop",
    amsterdam:
      "https://images.unsplash.com/photo-1459976717321-6120c194aa5e?w=800&h=600&fit=crop",
    berlin:
      "https://images.unsplash.com/photo-1552832920-c03dcf7d5d4c?w=800&h=600&fit=crop",
    istanbul:
      "https://images.unsplash.com/photo-1520934957837-5e894e0f1e7f?w=800&h=600&fit=crop",
    bangkok:
      "https://images.unsplash.com/photo-1563986768711-b3bfb9ec2006?w=800&h=600&fit=crop",
    singapore:
      "https://images.unsplash.com/photo-1512668337023-cb70f16f4b5d?w=800&h=600&fit=crop",
    "hong kong":
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    mumbai:
      "https://images.unsplash.com/photo-1527069376412-61b3e30c1b45?w=800&h=600&fit=crop",
    delhi:
      "https://images.unsplash.com/photo-1526591906219-a5378c9ba46d?w=800&h=600&fit=crop",
  };

  const lowerCaseQuery = query.toLowerCase().trim();
  const placeholderUrl =
    placeholderImages[lowerCaseQuery] ||
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"; // Generic travel image

  return {
    source: "unsplash_generic",
    images: [
      {
        url: placeholderUrl,
        caption: query,
        credit: "Photo from Unsplash",
      },
    ],
  };
}

// Cache to avoid repeated API calls
const imageCache = {};

async function getDestinationImages(query, forceRefresh = false) {
  const cacheKey = query.toLowerCase().trim();

  if (imageCache[cacheKey] && !forceRefresh) {
    return imageCache[cacheKey];
  }

  const result = await fetchDestinationImages(query);
  imageCache[cacheKey] = result;
  return result;
}

module.exports = {
  fetchDestinationImages,
  getDestinationImages,
};
