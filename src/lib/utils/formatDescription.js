export function formatSellerDescription(text) {
    // Helper function to capitalize first letter of each word
    const capitalizeWords = (str) => {
        return str.replace(/\b\w/g, c => c.toUpperCase());
    };

    // Helper function to clean and format feature text
    const cleanFeatureText = (feature) => {
        return feature
            .trim()
            .replace(/^and /, '')
            .replace(/\s+/g, ' ');
    };

    // Extract year, make, and model if present at the end
    const carInfoMatch = text.match(/(\d{4})\s+(\w+)\s+(\w+\s+\w+\s*\w*)\s*$/);
    const carInfo = carInfoMatch ? {
        year: carInfoMatch[1],
        make: carInfoMatch[2],
        model: carInfoMatch[3]
    } : null;

    // Split into main sections
    const sections = text.split(/(?=With over|Used Cars)/);
    const featuresText = sections[0];

    // Extract and format features
    let features = featuresText
        .replace(/Key Features Description |Priced below.*?!/, '')
        .split(',')
        .map(cleanFeatureText)
        .filter(feature => feature.length > 0);

    // Separate features into categories
    const categories = {
        exterior: ['Wheels', 'Spoiler', 'Camera', 'Headlights', 'Bumpers', 'Wipers', 'Windows'],
        interior: ['Seats', 'Steering', 'Air Conditioning', 'Temperature', 'Radio', 'CD', 'Audio', 'CarPlay', 'Android Auto'],
        safety: ['Airbag', 'ABS', 'Brake', 'Stability Control', 'Traction control', 'Security'],
        comfort: ['Memory', 'Heated', 'Ventilated', 'Power', 'Remote', 'HomeLink']
    };

    const categorizedFeatures = {
        exterior: [],
        interior: [],
        safety: [],
        comfort: [],
        other: []
    };

    features.forEach(feature => {
        let categorized = false;
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => feature.toLowerCase().includes(keyword.toLowerCase()))) {
                categorizedFeatures[category].push(feature);
                categorized = true;
                break;
            }
        }
        if (!categorized) {
            categorizedFeatures.other.push(feature);
        }
    });

    // Generate HTML with added spacing and bold elements
    let html = '<div class="car-listing" style="line-height: 1.6;">';

    // Add car info if available
    if (carInfo) {
        html += `
        <h1 class="car-title" style="font-size: 1.8em; margin: 1em 0;">
          ${carInfo.year} ${carInfo.make} ${carInfo.model}
        </h1>
      `;
    }

    html += '<div class="features-section">';
    html += '<strong style="font-size: 1.3em; ">Key Features</strong>';

    // Add categorized features with increased spacing
    for (const [category, categoryFeatures] of Object.entries(categorizedFeatures)) {
        if (categoryFeatures.length > 0) {
            html += `
          <div class="feature-category" style="margin: 1rem 0; border-radius: 8px;">
            <h3 style="font-size: 1.2em; margin-bottom: 0.8em;">
              <strong>${capitalizeWords(category)}</strong>
            </h3>
            <ul style="list-style-type: disc; margin-left: 1.5em; margin-bottom: 1em;">
              ${categoryFeatures.map(feature => `
                <li style="margin: 0.5em 0;">
                  ${feature}
                </li>`).join('\n')}
            </ul>
          </div>
        `;
        }
    }

    html += '</div>';

    // Add dealer description if present
    if (sections[1]) {
        html += `
        <div class="dealer-info" style="margin: 2em 0;">
          <h3 style="font-size: 1.3em; margin-bottom: 0.5rem;">
            <strong>Dealer Information</strong>
          </h3>
          <p style="line-height: 1.6;">
            ${sections[1].trim()}
          </p>
        </div>
      `;
    }

    html += '</div>';

    return html;
}