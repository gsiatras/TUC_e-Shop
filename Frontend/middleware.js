import { NextResponse } from 'next/server';
import { decodeJwt } from './utils/jwtUtils';

export async function middleware(req) {
  try {
    let rl = null;

    if (req.cookies) {
      
      let accessToken = req.cookies?.get('access_token')?.value;
      console.log(accessToken);

      if (accessToken) {
        console.log(accessToken);
        const decodedToken = await decodeJwt(accessToken);
        const { preferred_username: uname, email, realm_access: { roles } } = decodedToken;
        rl = roles.includes("Customer") ? "Customer" : roles.includes("Seller") ? "Seller" : null;
      }
    }

    
    const url = req.url;
    const absoluteHomeUrl = new URL('/', req.nextUrl);
    if ((!accessToken && url.includes('/seller')) || (accessToken && rl !== 'Seller' && url.includes('/seller'))) {
      //console.log("Redirecting to home URL due to seller conditions"); // Add this line for debugging
      return NextResponse.redirect(absoluteHomeUrl);
    } else if ((!accessToken && url.includes('/customer')) || (accessToken && rl !== 'Customer' && url.includes('/customer'))) {
      //console.log("Redirecting to home URL due to customer conditions"); // Add this line for debugging
      return NextResponse.redirect(absoluteHomeUrl);
    }

    //console.log('Continuing with the request'); // Add this line for debugging
    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.error();
  }
}
