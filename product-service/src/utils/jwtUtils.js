const base64Decode = (base64) => {
    const buffer = Buffer.from(base64, 'base64');
    return buffer.toString('utf-8');
  };
  
export const decodeJwt = (jwtToken) => {
  const [, base64Url] = jwtToken.split('.');
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  try {
    const jsonPayload = base64Decode(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};