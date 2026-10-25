/**
 * OWLERA India PIN Code & Address Validation Engine
 * 
 * Accurately validates Indian 6-digit postal PIN codes, maps them to States/UTs,
 * detects state-city mismatches, and prevents fraudulent/inconsistent checkout addresses.
 */

export interface PincodeInfo {
  state: string;
  allowedStates: string[];
  districtHint?: string;
}

// Prefix to State mapping (Postal Circles of India)
export const PINCODE_PREFIX_MAP: Record<string, { state: string; allowedStates: string[]; defaultCity?: string }> = {
  // Northern Region
  "11": { state: "Delhi (NCT)", allowedStates: ["Delhi (NCT)"], defaultCity: "New Delhi" },
  "12": { state: "Haryana", allowedStates: ["Haryana"], defaultCity: "Gurugram" },
  "13": { state: "Haryana", allowedStates: ["Haryana"], defaultCity: "Ambala" },
  "14": { state: "Punjab", allowedStates: ["Punjab"], defaultCity: "Ludhiana" },
  "15": { state: "Punjab", allowedStates: ["Punjab"], defaultCity: "Bathinda" },
  "16": { state: "Chandigarh", allowedStates: ["Chandigarh", "Punjab", "Haryana"], defaultCity: "Chandigarh" },
  "17": { state: "Himachal Pradesh", allowedStates: ["Himachal Pradesh"], defaultCity: "Shimla" },
  "18": { state: "Jammu and Kashmir", allowedStates: ["Jammu and Kashmir", "Ladakh"], defaultCity: "Jammu" },
  "19": { state: "Jammu and Kashmir", allowedStates: ["Jammu and Kashmir", "Ladakh"], defaultCity: "Srinagar" },

  // Uttar Pradesh & Uttarakhand
  "20": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh"], defaultCity: "Aligarh" },
  "21": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh"], defaultCity: "Prayagraj" },
  "22": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh"], defaultCity: "Lucknow" },
  "23": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh"], defaultCity: "Varanasi" },
  "24": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh", "Uttarakhand"], defaultCity: "Moradabad" },
  "25": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh"], defaultCity: "Meerut" },
  "26": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh", "Uttarakhand"], defaultCity: "Bareilly" },
  "27": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh"], defaultCity: "Gorakhpur" },
  "28": { state: "Uttar Pradesh", allowedStates: ["Uttar Pradesh"], defaultCity: "Agra" },

  // Western Region
  "30": { state: "Rajasthan", allowedStates: ["Rajasthan"], defaultCity: "Jaipur" },
  "31": { state: "Rajasthan", allowedStates: ["Rajasthan"], defaultCity: "Udaipur" },
  "32": { state: "Rajasthan", allowedStates: ["Rajasthan"], defaultCity: "Kota" },
  "33": { state: "Rajasthan", allowedStates: ["Rajasthan"], defaultCity: "Bikaner" },
  "34": { state: "Rajasthan", allowedStates: ["Rajasthan"], defaultCity: "Jodhpur" },
  "36": { state: "Gujarat", allowedStates: ["Gujarat"], defaultCity: "Rajkot" },
  "37": { state: "Gujarat", allowedStates: ["Gujarat"], defaultCity: "Bhuj" },
  "38": { state: "Gujarat", allowedStates: ["Gujarat"], defaultCity: "Ahmedabad" },
  "39": { state: "Gujarat", allowedStates: ["Gujarat"], defaultCity: "Surat" },

  // Western & Central Region
  "40": { state: "Maharashtra", allowedStates: ["Maharashtra", "Goa"], defaultCity: "Mumbai" },
  "41": { state: "Maharashtra", allowedStates: ["Maharashtra"], defaultCity: "Pune" },
  "42": { state: "Maharashtra", allowedStates: ["Maharashtra"], defaultCity: "Nashik" },
  "43": { state: "Maharashtra", allowedStates: ["Maharashtra"], defaultCity: "Aurangabad" },
  "44": { state: "Maharashtra", allowedStates: ["Maharashtra"], defaultCity: "Nagpur" },
  "45": { state: "Madhya Pradesh", allowedStates: ["Madhya Pradesh"], defaultCity: "Indore" },
  "46": { state: "Madhya Pradesh", allowedStates: ["Madhya Pradesh"], defaultCity: "Bhopal" },
  "47": { state: "Madhya Pradesh", allowedStates: ["Madhya Pradesh"], defaultCity: "Gwalior" },
  "48": { state: "Madhya Pradesh", allowedStates: ["Madhya Pradesh"], defaultCity: "Jabalpur" },
  "49": { state: "Chhattisgarh", allowedStates: ["Chhattisgarh"], defaultCity: "Raipur" },

  // Southern Region
  "50": { state: "Telangana", allowedStates: ["Telangana"], defaultCity: "Hyderabad" },
  "51": { state: "Andhra Pradesh", allowedStates: ["Andhra Pradesh"], defaultCity: "Tirupati" },
  "52": { state: "Andhra Pradesh", allowedStates: ["Andhra Pradesh"], defaultCity: "Vijayawada" },
  "53": { state: "Andhra Pradesh", allowedStates: ["Andhra Pradesh"], defaultCity: "Visakhapatnam" },
  "56": { state: "Karnataka", allowedStates: ["Karnataka"], defaultCity: "Bengaluru" },
  "57": { state: "Karnataka", allowedStates: ["Karnataka"], defaultCity: "Mysuru" },
  "58": { state: "Karnataka", allowedStates: ["Karnataka"], defaultCity: "Hubballi" },
  "59": { state: "Karnataka", allowedStates: ["Karnataka"], defaultCity: "Belagavi" },
  "60": { state: "Tamil Nadu", allowedStates: ["Tamil Nadu", "Puducherry"], defaultCity: "Chennai" },
  "61": { state: "Tamil Nadu", allowedStates: ["Tamil Nadu"], defaultCity: "Tiruchirappalli" },
  "62": { state: "Tamil Nadu", allowedStates: ["Tamil Nadu"], defaultCity: "Madurai" },
  "63": { state: "Tamil Nadu", allowedStates: ["Tamil Nadu"], defaultCity: "Salem" },
  "64": { state: "Tamil Nadu", allowedStates: ["Tamil Nadu"], defaultCity: "Coimbatore" },
  "67": { state: "Kerala", allowedStates: ["Kerala", "Lakshadweep"], defaultCity: "Kozhikode" },
  "68": { state: "Kerala", allowedStates: ["Kerala", "Lakshadweep"], defaultCity: "Kochi" },
  "69": { state: "Kerala", allowedStates: ["Kerala"], defaultCity: "Thiruvananthapuram" },

  // Eastern & North Eastern Region
  "70": { state: "West Bengal", allowedStates: ["West Bengal"], defaultCity: "Kolkata" },
  "71": { state: "West Bengal", allowedStates: ["West Bengal"], defaultCity: "Howrah" },
  "72": { state: "West Bengal", allowedStates: ["West Bengal"], defaultCity: "Medinipur" },
  "73": { state: "West Bengal", allowedStates: ["West Bengal", "Sikkim"], defaultCity: "Siliguri" },
  "74": { state: "West Bengal", allowedStates: ["West Bengal"], defaultCity: "Kalyani" },
  "75": { state: "Odisha", allowedStates: ["Odisha"], defaultCity: "Bhubaneswar" },
  "76": { state: "Odisha", allowedStates: ["Odisha"], defaultCity: "Rourkela" },
  "77": { state: "Odisha", allowedStates: ["Odisha"], defaultCity: "Sambalpur" },
  "78": { state: "Assam", allowedStates: ["Assam"], defaultCity: "Guwahati" },
  "79": {
    state: "Meghalaya",
    allowedStates: [
      "Arunachal Pradesh",
      "Meghalaya",
      "Manipur",
      "Mizoram",
      "Nagaland",
      "Tripura"
    ],
    defaultCity: "Shillong"
  },
  "80": { state: "Bihar", allowedStates: ["Bihar"], defaultCity: "Patna" },
  "81": { state: "Bihar", allowedStates: ["Bihar", "Jharkhand"], defaultCity: "Bhagalpur" },
  "82": { state: "Bihar", allowedStates: ["Bihar", "Jharkhand"], defaultCity: "Gaya" },
  "83": { state: "Jharkhand", allowedStates: ["Jharkhand"], defaultCity: "Ranchi" },
  "84": { state: "Bihar", allowedStates: ["Bihar"], defaultCity: "Muzaffarpur" },
  "85": { state: "Bihar", allowedStates: ["Bihar"], defaultCity: "Darbhanga" }
};

// 3-digit refinements for Uttarakhand, Goa, Sikkim, and NE States
export const SPECIFIC_PREFIX_MAP: Record<string, { state: string; defaultCity: string }> = {
  // Goa
  "403": { state: "Goa", defaultCity: "Panaji" },
  // Puducherry
  "605": { state: "Puducherry", defaultCity: "Puducherry" },
  // Sikkim
  "737": { state: "Sikkim", defaultCity: "Gangtok" },
  // Uttarakhand
  "248": { state: "Uttarakhand", defaultCity: "Dehradun" },
  "249": { state: "Uttarakhand", defaultCity: "Haridwar" },
  "246": { state: "Uttarakhand", defaultCity: "Rudraprayag" },
  "263": { state: "Uttarakhand", defaultCity: "Nainital" },
  // North East specifics
  "790": { state: "Arunachal Pradesh", defaultCity: "Itanagar" },
  "791": { state: "Arunachal Pradesh", defaultCity: "Naharlagun" },
  "792": { state: "Arunachal Pradesh", defaultCity: "Pasighat" },
  "793": { state: "Meghalaya", defaultCity: "Shillong" },
  "794": { state: "Meghalaya", defaultCity: "Tura" },
  "795": { state: "Manipur", defaultCity: "Imphal" },
  "796": { state: "Mizoram", defaultCity: "Aizawl" },
  "797": { state: "Nagaland", defaultCity: "Kohima" },
  "799": { state: "Tripura", defaultCity: "Agartala" }
};

// Prominent Indian city to state mapping for cross-checking city/state mismatch
export const CITY_TO_STATE_MAP: Record<string, string> = {
  hyderabad: "Telangana",
  secunderabad: "Telangana",
  warangal: "Telangana",
  karimnagar: "Telangana",
  nizamabad: "Telangana",
  bengaluru: "Karnataka",
  bangalore: "Karnataka",
  mysuru: "Karnataka",
  mysore: "Karnataka",
  mumbai: "Maharashtra",
  pune: "Maharashtra",
  nagpur: "Maharashtra",
  nashik: "Maharashtra",
  thane: "Maharashtra",
  delhi: "Delhi (NCT)",
  "new delhi": "Delhi (NCT)",
  gurugram: "Haryana",
  gurgaon: "Haryana",
  faridabad: "Haryana",
  noida: "Uttar Pradesh",
  "greater noida": "Uttar Pradesh",
  lucknow: "Uttar Pradesh",
  kanpur: "Uttar Pradesh",
  agra: "Uttar Pradesh",
  varanasi: "Uttar Pradesh",
  kolkata: "West Bengal",
  howrah: "West Bengal",
  chennai: "Tamil Nadu",
  coimbatore: "Tamil Nadu",
  madurai: "Tamil Nadu",
  ahmedabad: "Gujarat",
  surat: "Gujarat",
  vadodara: "Gujarat",
  jaipur: "Rajasthan",
  jodhpur: "Rajasthan",
  udaipur: "Rajasthan",
  guwahati: "Assam",
  silchar: "Assam",
  dibrugarh: "Assam",
  patna: "Bihar",
  ranchi: "Jharkhand",
  jamshedpur: "Jharkhand",
  bhubaneswar: "Odisha",
  cuttack: "Odisha",
  thiruvananthapuram: "Kerala",
  kochi: "Kerala",
  cochin: "Kerala",
  calicut: "Kerala",
  kozhikode: "Kerala",
  visakhapatnam: "Andhra Pradesh",
  vijayawada: "Andhra Pradesh",
  guntur: "Andhra Pradesh",
  tirupati: "Andhra Pradesh",
  bhopal: "Madhya Pradesh",
  indore: "Madhya Pradesh",
  raipur: "Chhattisgarh",
  chandigarh: "Chandigarh",
  dehradun: "Uttarakhand"
};

/**
 * Returns detected state and candidate city based on a 6-digit PIN code
 */
export function lookupPincode(pincode: string): { state: string; allowedStates: string[]; defaultCity?: string } | null {
  const clean = pincode.trim().replace(/\D/g, "");
  if (clean.length < 2) return null;

  const prefix3 = clean.slice(0, 3);
  if (SPECIFIC_PREFIX_MAP[prefix3]) {
    const spec = SPECIFIC_PREFIX_MAP[prefix3];
    return {
      state: spec.state,
      allowedStates: [spec.state],
      defaultCity: spec.defaultCity
    };
  }

  const prefix2 = clean.slice(0, 2);
  const found = PINCODE_PREFIX_MAP[prefix2];
  if (found) {
    return found;
  }

  return null;
}

/**
 * Validates whether the entered pincode, selected state, and entered city are consistent.
 */
export function validateAddressDetails(
  pincode: string,
  state: string,
  city?: string
): {
  isValid: boolean;
  detectedState?: string;
  suggestedCity?: string;
  errorMessage?: string;
} {
  const cleanPin = (pincode || "").trim().replace(/\D/g, "");

  if (!cleanPin || cleanPin.length !== 6) {
    return {
      isValid: false,
      errorMessage: "Please enter a valid 6-digit Indian PIN code."
    };
  }

  const pinInfo = lookupPincode(cleanPin);

  if (!pinInfo) {
    return {
      isValid: false,
      errorMessage: `PIN code ${cleanPin} is not a recognized Indian postal code.`
    };
  }

  // Check state consistency
  const normState = (state || "").trim().toLowerCase();
  const isStateAllowed = pinInfo.allowedStates.some(
    st => st.toLowerCase() === normState
  );

  if (!isStateAllowed) {
    return {
      isValid: false,
      detectedState: pinInfo.state,
      suggestedCity: pinInfo.defaultCity,
      errorMessage: `PIN code ${cleanPin} is in ${pinInfo.state}, but you have selected "${state}". Please select ${pinInfo.state}.`
    };
  }

  // Check city vs state mismatch if city is provided
  if (city && city.trim().length > 1) {
    const cleanCity = city.trim().toLowerCase();
    const knownStateForCity = CITY_TO_STATE_MAP[cleanCity];
    if (knownStateForCity && knownStateForCity.toLowerCase() !== normState) {
      return {
        isValid: false,
        detectedState: knownStateForCity,
        errorMessage: `"${city.trim()}" is located in ${knownStateForCity}, not ${state}. Please update your city or state.`
      };
    }
  }

  return {
    isValid: true,
    detectedState: pinInfo.state,
    suggestedCity: pinInfo.defaultCity
  };
}
