import Cookies from 'js-cookie'
import { NextResponse } from 'next/server'


// This function can be marked `async` if using `await` inside
export async function middleware(req) {
    // Use try-catch to handle any potential errors
    try {
      // Use `await` for asynchronous operations
        let cookie = req.cookies.get('role')
        const url = req.url;
        const absoluteHomeUrl = new URL('/', req.nextUrl);
        // Check if the user is not a seller and is trying to access a '/seller' path
        if (!cookie && url.includes('/seller') || (cookie && cookie.value !== 'Seller' && url.includes('/seller'))) {
            //console.log("Not authenticated");
            
            return NextResponse.redirect(absoluteHomeUrl);
        } else if (!cookie && url.includes('/customer') || (cookie && cookie.value !== 'Customer' && url.includes('/customer'))) {
            
            return NextResponse.redirect(absoluteHomeUrl);
        }
    
        // If the conditions are not met, continue with the request
        //console.log('authenticated!')
        return NextResponse.next();
    } catch (error) {
        // Handle any errors that occur during the asynchronous operations
        //console.error('Error in middleware:', error);
        return NextResponse.error();
    }
  }
