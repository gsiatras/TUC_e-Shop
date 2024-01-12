import { NextResponse } from 'next/server';
import { decodeJwt } from './utils/jwtUtils';

export async function middleware(req) {
  try {
    let accessToken = null;
    let rl = null;

    if (req.cookies) {
      accessToken = req.cookies?.get('access_token')?.value;

      if (accessToken) {
        const decodedToken = await decodeJwt(accessToken);
        const { preferred_username: uname, email, realm_access: { roles } } = decodedToken;
        rl = roles.includes("Customer") ? "Customer" : roles.includes("Seller") ? "Seller" : null;
      }
    }

    let url = '/';
    if (req.url) {
      console.log('Request URL exists');
      url = req.url;
    }

    console.log('Request URL:', url); // Add this line for debugging
    const absoluteHomeUrl = req.nextUrl ? new URL('/', req.nextUrl) : new URL('/');
    console.log('Absolute Home URL:', absoluteHomeUrl); // Add this line for debugging

    if ((!accessToken && url.includes('/seller')) || (accessToken && rl !== 'Seller' && url.includes('/seller'))) {
      console.log("Redirecting to home URL due to seller conditions"); // Add this line for debugging
      return NextResponse.redirect(absoluteHomeUrl);
    } else if ((!accessToken && url.includes('/customer')) || (accessToken && rl !== 'Customer' && url.includes('/customer'))) {
      console.log("Redirecting to home URL due to customer conditions"); // Add this line for debugging
      return NextResponse.redirect(absoluteHomeUrl);
    }

    console.log('Continuing with the request'); // Add this line for debugging
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.error();
  }
}
