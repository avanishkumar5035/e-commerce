// Controller for fetching accurate Indian PIN code & Live Location addresses
// Uses Google Gemini AI + OpenStreetMap Nominatim + Postal Directory fallback

const locationCache = new Map();

// Helper: OpenStreetMap Nominatim reverse geocode
async function reverseGeocodeOSM(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'EcommerceShopSphere/1.0 (contact@shopsphere.local)'
        }
    });

    if (!response.ok) {
        throw new Error(`Nominatim error status: ${response.status}`);
    }

    return await response.json();
}

// Helper: Reverse Geocode via Gemini AI
async function reverseGeocodeGemini(latitude, longitude, rawOSM, apiKey, model = 'gemini-1.5-flash') {
    const prompt = `You are an Indian geographical location and delivery address assistant.
A customer is sharing their live GPS coordinates for an e-commerce order delivery.
Coordinates: Latitude: ${latitude}, Longitude: ${longitude}
${rawOSM ? `Raw Reverse-Geocoded Context: ${JSON.stringify(rawOSM.address || rawOSM)}` : ''}

Determine the accurate, human-readable Indian delivery address:
- pincode: The correct 6-digit Indian PIN code for these coordinates
- primaryLocation: The specific village, mohalla, colony, sector, or neighborhood name
- localities: Array of nearby small villages, landmarks, colonies, or areas
- subDistrict: Tehsil / Taluk / Block
- district: District name
- state: State name
- formattedAddress: Clean, complete address string (e.g., "House/Street/Village, Tehsil, District, State, PIN")

Return ONLY valid JSON (no markdown, no backticks, no extra text):
{
  "success": true,
  "pincode": "...",
  "primaryLocation": "...",
  "localities": ["..."],
  "subDistrict": "...",
  "district": "...",
  "state": "...",
  "formattedAddress": "..."
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json'
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini reverse geocode error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
        throw new Error('No content returned from Gemini');
    }

    const cleaned = candidateText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
}

// Helper: Query Google Gemini API for PIN code
async function fetchFromGemini(pincode, apiKey, model = 'gemini-1.5-flash') {
    const prompt = `You are an Indian geographical location database assistant.
For the 6-digit Indian Postal PIN code "${pincode}", provide accurate, comprehensive location details.
Make sure to include specific small places, villages (gram/gaon), hamlets, sub-localities, wards, colonies, mohallas, tehsils/talukas, and blocks covered under this PIN code.

Return ONLY a valid JSON object (no markdown, no backticks, no explanation) with this structure:
{
  "pincode": "${pincode}",
  "success": true,
  "primaryLocation": "Main locality, village or post office name",
  "localities": ["Village or Locality 1", "Village or Locality 2", "Village or Locality 3"],
  "subDistrict": "Tehsil / Taluka / Block",
  "district": "District Name",
  "state": "State Name",
  "formattedAddress": "Primary Locality, SubDistrict, District, State"
}

If this 6-digit PIN code is invalid or does not exist in India, return:
{
  "pincode": "${pincode}",
  "success": false,
  "message": "Invalid PIN code"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json'
            }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
        throw new Error('No content returned from Gemini');
    }

    const cleaned = candidateText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
}

// Fallback: Postal Directory API
async function fetchFromPostalDirectory(pincode) {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    if (!response.ok) {
        throw new Error(`Postal API responded with status ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data[0] || data[0].Status !== 'Success' || !data[0].PostOffice || data[0].PostOffice.length === 0) {
        return {
            pincode,
            success: false,
            message: 'PIN code not found or invalid'
        };
    }

    const postOffices = data[0].PostOffice;
    const localitySet = new Set();
    postOffices.forEach(po => {
        if (po.Name) {
            const cleanName = po.Name.replace(/\s*(B\.O|S\.O|H\.O)\s*$/i, '').trim();
            if (cleanName) localitySet.add(cleanName);
        }
    });

    const localities = Array.from(localitySet);
    const primary = postOffices[0];
    const primaryClean = primary.Name.replace(/\s*(B\.O|S\.O|H\.O)\s*$/i, '').trim();
    const subDistrict = primary.Block && primary.Block !== 'NA' ? primary.Block : (primary.Taluk && primary.Taluk !== 'NA' ? primary.Taluk : '');
    const district = primary.District;
    const state = primary.State;

    const formattedParts = [primaryClean];
    if (subDistrict && subDistrict !== district && subDistrict !== primaryClean) {
        formattedParts.push(subDistrict);
    }
    if (district) formattedParts.push(district);
    if (state) formattedParts.push(state);

    return {
        pincode,
        success: true,
        primaryLocation: primaryClean,
        localities,
        subDistrict,
        district,
        state,
        formattedAddress: formattedParts.join(', ')
    };
}

// @desc    Get accurate location details for a PIN code
// @route   GET /api/location/pincode/:pincode
// @access  Public
const getPincodeDetails = async (req, res) => {
    try {
        const pincode = req.params.pincode?.trim();

        if (!pincode || !/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 6-digit Indian PIN code'
            });
        }

        if (locationCache.has(pincode)) {
            return res.json({
                ...locationCache.get(pincode),
                cached: true
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

        let result = null;
        let source = 'unknown';

        if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
            try {
                const geminiData = await fetchFromGemini(pincode, apiKey, model);
                if (geminiData && geminiData.success) {
                    result = geminiData;
                    source = 'gemini';
                }
            } catch (geminiError) {
                console.warn(`[Gemini Location API] Fallback to postal directory:`, geminiError.message);
            }
        }

        if (!result) {
            try {
                const postalData = await fetchFromPostalDirectory(pincode);
                if (postalData && postalData.success) {
                    result = postalData;
                    source = 'postal_directory';
                } else if (postalData && !postalData.success) {
                    return res.status(404).json(postalData);
                }
            } catch (postalError) {
                console.error(`[Postal Directory API] Fallback error:`, postalError.message);
            }
        }

        if (!result || !result.success) {
            return res.status(404).json({
                pincode,
                success: false,
                message: 'Could not find address details for this PIN code.'
            });
        }

        const finalResponse = {
            ...result,
            source,
            timestamp: new Date().toISOString()
        };

        locationCache.set(pincode, finalResponse);
        return res.json(finalResponse);
    } catch (error) {
        console.error('Pincode controller error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching PIN code details',
            error: error.message
        });
    }
};

// @desc    Reverse geocode live coordinates (latitude & longitude) into exact address & pincode
// @route   POST /api/location/reverse-geocode
// @access  Public
const reverseGeocode = async (req, res) => {
    try {
        const latitude = req.body?.latitude ?? req.query?.latitude;
        const longitude = req.body?.longitude ?? req.query?.longitude;

        if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid latitude and longitude coordinates.'
            });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        let rawOSM = null;
        try {
            rawOSM = await reverseGeocodeOSM(lat, lng);
        } catch (osmError) {
            console.warn('[OSM Geocode] Reverse lookup warning:', osmError.message);
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

        let result = null;
        let source = 'osm_gps';

        // 1. Try Gemini AI with coordinates + raw OSM context
        if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_gemini_api_key_here') {
            try {
                const geminiResult = await reverseGeocodeGemini(lat, lng, rawOSM, apiKey, model);
                if (geminiResult && geminiResult.success) {
                    result = geminiResult;
                    source = 'gemini';
                }
            } catch (geminiError) {
                console.warn('[Gemini Reverse Geocode] Fallback to OSM:', geminiError.message);
            }
        }

        // 2. Fallback to OSM parsed data
        if (!result && rawOSM && rawOSM.address) {
            const addr = rawOSM.address;
            const primary = addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || addr.town || addr.road || addr.city_district || addr.city || 'Live Location';
            const district = addr.state_district || addr.county || addr.city || '';
            const state = addr.state || '';
            const pincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '';
            const subDistrict = addr.suburb || addr.town || addr.county || '';

            const parts = [];
            if (addr.house_number) parts.push(addr.house_number);
            if (addr.road) parts.push(addr.road);
            if (primary && !parts.includes(primary)) parts.push(primary);
            if (district && !parts.includes(district)) parts.push(district);
            if (state && !parts.includes(state)) parts.push(state);
            if (pincode) parts.push(pincode);

            result = {
                success: true,
                pincode,
                primaryLocation: primary,
                localities: [primary, addr.road, addr.suburb, addr.village].filter(Boolean),
                subDistrict,
                district,
                state,
                formattedAddress: parts.join(', ') || rawOSM.display_name
            };
            source = 'gps_nominatim';
        }

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Unable to determine address from the provided coordinates.'
            });
        }

        return res.json({
            ...result,
            latitude: lat,
            longitude: lng,
            mapUrl,
            source,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Reverse geocode error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error processing live location',
            error: error.message
        });
    }
};

module.exports = {
    getPincodeDetails,
    reverseGeocode
};
