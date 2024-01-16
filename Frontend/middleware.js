import { NextResponse } from 'next/server';
import { decodeJwt } from './utils/jwtUtils';

export async function middleware(req) {
  try {
    let rl = null;
    

    if (req.cookies) {
      rl = req.cookies?.get('role')?.value;
      //console.log(accessToken);
    }

    const url = req.url;
    const absoluteHomeUrl = new URL('/', req.nextUrl);

    if ((!rl && url.includes('/seller')) || (rl !== 'Seller' && url.includes('/seller'))) {
      //console.log("Redirecting to home URL due to seller conditions"); // Add this line for debugging
      return NextResponse.redirect(absoluteHomeUrl);
    } else if ((!rl && url.includes('/customer')) || (rl !== 'Customer' && url.includes('/customer'))) {
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
