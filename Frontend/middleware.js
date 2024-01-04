import { NextResponse } from 'next/server'
import { decodeJwt } from './utils/jwtUtils';

// This function can be marked `async` if using `await` inside
export async function middleware(req) {
    // Use try-catch to handle any potential errors
    try {
      // Access the "access_token" cookie
      const accessToken = req.cookies?.get('access_token')?.value;
      
      
      //console.log(accessToken);
      let rl = null;
      if (accessToken){
        const decodedToken = await decodeJwt(accessToken);
        const { preferred_username: uname, email, realm_access: { roles } } = decodedToken;
        rl = roles.includes("Customer") ? "Customer" : roles.includes("Seller") ? "Seller" : null;
        //console.log(rl);
      }
        
      const url = req.url;
      const absoluteHomeUrl = new URL('/', req.nextUrl);
      // Check if the user is not a seller and is trying to access a '/seller' path
      if (!accessToken && url.includes('/seller') || (accessToken &&  rl !== 'Seller' && url.includes('/seller'))) {
        //console.log("Not authenticated");
        
        
        return NextResponse.redirect(absoluteHomeUrl);
        
      } else if (!accessToken && url.includes('/customer') || (accessToken && rl !== 'Customer' && url.includes('/customer'))) {
        console.log("Not authenticated");
        console.log(accessToken);
        console.log(req.cookies);
        
        return NextResponse.redirect(absoluteHomeUrl);
      }
  
      // If the conditions are not met, continue with the request
      //console.log('authenticated!')
      return NextResponse.next();
    } catch (error) {
      // Handle any errors that occur during the asynchronous operations
      console.error('Error in middleware:', error);
      return NextResponse.error();
    }
  }
