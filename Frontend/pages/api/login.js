import { decodeJwt } from "@/utils/jwtUtils";
import Cookies from "js-cookie";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.json('error');
    }

    if (req.query?.login) {
        
        const {username, password} = req.body;
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            
            var urlencoded = new URLSearchParams();
            urlencoded.append("username", username);
            urlencoded.append("password", password);
            urlencoded.append("client_id", "client");
            urlencoded.append("client_secret", "3I5qTlVtM7oS4q8802rwJaKlRsiqD6Qp");
            urlencoded.append("grant_type", "password");
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: urlencoded,
              redirect: 'follow'
            };
            
            const response = await fetch("http://172.17.0.1:8080/auth/realms/eshop/protocol/openid-connect/token", requestOptions)

            if (response.ok) {
                const login_response = await response.json()
                const token = login_response.access_token;
                const refresh_token = login_response.refresh_token;
                const decodeToken =  await decodeJwt(token)
                //console.log(decodeToken)
                
                
                const uname = decodeToken.preferred_username;
                const mail = decodeToken.email;
                const roles = decodeToken.realm_access.roles;
                const rl = roles.includes("Customer") ? "Customer" :
                roles.includes("Seller") ? "Seller" : null;
                const data = {uname, mail, rl, token};
                
                // Use this function after receiving the access token from the server
                
                res.json(data);

                } else {
                    const err = await response.json()
                    //alert("Login failed: " + err.error_description);
                    res.json(err);
                }
                } catch (error) {
                    console.log('Error during loging: ', error)
                }
        };

        if (req.query?.register) {
            const { username, email, password, role } = req.body;
            //console.log('Register:', { username, email, password, role });

            // Get access token
            try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "client_credentials");
            urlencoded.append("client_id", "admin-cli");
            urlencoded.append("client_secret", "LP6r0AqrCs4mI0juhUCQzLhfj8akFOdq");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            const first_response = await fetch("http://172.17.0.1:8080/auth/realms/master/protocol/openid-connect/token", requestOptions)
            //console.log(first_response);
            if (first_response.ok) {
                const adminAccessToken = await first_response.json();
                //console.log(adminAccessToken)
                const token = adminAccessToken.access_token
                //console.log(adminAccessToken);

                // Register after getting the access token
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", "Bearer " + token);
                
                var raw = JSON.stringify({
                "email": email,
                "enabled": "true",
                "username": username,
                "attributes": {
                    "client_id": "client"
                },
                "groups": [
                    role
                ],
                "credentials": [
                    {
                    "type": "password",
                    "value": password,
                    "temporary": false
                    }
                ]
                });
                
                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };
                
                const register_user = await fetch("http://172.17.0.1:8080/auth/admin/realms/eshop/users", requestOptions)
                //console.log(register_user);
                if (register_user.ok) {
                    res.json(ok);

                } else {
                    res.json('error');
                }

            } else {
                const error = await first_response.json();
                res.json(error);
            }
            } catch (error) {
                res.json(error);
            }
        }
        
        if (req.query?.logout) {
            try {
                //console.log(req.cookies);
                const refreshToken = req.cookies.refresh_token;
                //console.log(refreshToken);
                const logoutUrl = `http://172.17.0.1:8080/auth/realms/eshop/protocol/openid-connect/logout`;
                var urlencoded = new URLSearchParams();
                urlencoded.append("client_id", "client");
                urlencoded.append("client_secret", "3I5qTlVtM7oS4q8802rwJaKlRsiqD6Qp");
                urlencoded.append('refresh_token', refreshToken);
                
    
                const response = await fetch(logoutUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlencoded,
                })

                // Assuming 'res' is the response object
                res.setHeader('Set-Cookie', [
                    'access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
                    'refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
                ]);
  
    
                if (response.ok) {      
                    //console.log('ok');
                    // Assuming 'res' is the response object
                    
                    res.json('ok');
                } else {
                    const err = await response.json();
                    console.log(err);
                    res.json(err);
                }
            } catch (error) {
                console.log(error);
                res.json('Error during loging: ', error)
            }
        }

        else{
            res.json('not supposed to happen');
        }
    
}

