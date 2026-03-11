// Live API origin (single source of truth)
const LIVE_API_ORIGIN = "https://karivepakbackend-1.onrender.com";
export const baseURL = LIVE_API_ORIGIN;

// OLD SERVERS (commented out)
// export const baseURL = 'https://devapigobooze.codefactstech.com/admin';
// export const baseURL = 'http://43.204.66.246:5001'
// LOCAL: export const baseURL = 'http://localhost:5001'

export const productBaseURL = `${LIVE_API_ORIGIN}/product/v1`;
export const variantsBaseURL = `${LIVE_API_ORIGIN}/product/v1/variants`;
export const orderURL = `${LIVE_API_ORIGIN}/order/api/orders`;
export const GOOGLE_MAP_API_KEY = "AIzaSyCtTH8DV1-h4tYTSb-geYjdn71a0Up_63k"

// LOCAL URL 
//  export const baseURL = 'http://localhost:5001';
// export const productBaseURL = "http://localhost:3500/v1";
//  export const orderURL = 'http://localhost:5002/api/orders';
// export const variantsBaseURL = "http://localhost:3500/v1/variants";
export const imageURL = 'https://gobooze-bucket.s3.eu-north-1.amazonaws.com/goboozestore/';


// export const imageURL = 'https://d12keppzk8wa17.cloudfront.net/goboozestore/';
