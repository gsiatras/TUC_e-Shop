import { useState } from 'react';
import { useRouter } from "next/router";
import styles from '../styles/LoginSignup.module.css'; 
import Cookies from 'js-cookie';



export default function LoginSignup() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [action, setAction] = useState("Login");
  const [role, setRole] = useState('');
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  
  const setCookie = (data) => {
    // Destructure data
    const { uname, mail, rl, refresh_token } = data;
  
    // Set cookies
    //console.log('setting cookie to ' + rl);
    Cookies.set('username', uname, { expires: 7 });
    Cookies.set('email', mail, { expires: 7 });
    Cookies.set('role', rl, { expires: 7 });
    Cookies.set('refreshToken', refresh_token, { expires: 7 });

    
  };

  const handleSignUpClick = () => {
    setUsername("");
    setPassword("");
    setRole('');
    setIsRightPanelActive(true);
    setAction("Sign Up");
    console.log(action);
  };

  const handleSignInClick = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setIsRightPanelActive(false);
    setAction("Login");
    console.log(action);
  };

  const handleRoleChange = (event) => {
    const { id, checked } = event.target;

    // Set the role based on the checkbox ID
    setRole(checked ? id === 'sellerCheck' ? 'Sellers' : 'Customers' : '');
  };

  const handleLoginSignup = async (e) => {
    e.preventDefault()
    if (action === "Login") {
      // Handle login action here
      if (!username || !password) {
        alert("Please fill out all fields!");
        return;
      }

      // Call the Login function asynchronously
      try {
        await Login({ username, password });
      } catch (error) {
        console.error('Login failed');
      }

    } else if (action === "Sign Up") {
      // Handle signup action here
      if (!username || !password || !email || (!role)) {
        alert("Please fill out all fields!");
        return;
      }

      // Call the Register function asynchronously
      try {
        await Register({ email, username, password, role });
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  };

  const Login = async (data) => {
    const { username, password } = data;

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
      
      const response = await fetch("http://localhost:8080/auth/realms/eshop/protocol/openid-connect/token", requestOptions)
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


          const data = {uname,mail,rl,refresh_token}; 
          setCookie(data);

          //new_role = Cookies.get('role');
          //
          // Navigate to the destination
          if (rl === "Seller") {
            router.push('/seller');  
          } else if (new_role === "Customer") {
            router.push('/costumer');
          }
            
          
        } else {
          const err = await response.json()
          console.log('Login failed ', err)
          Cookies.remove('role');
          Cookies.remove('username');
          Cookies.remove('email');
          alert("Login failed: " + err.error_description);
          return err;
        }
    } catch (error) {
      console.log('Error during loging: ', error)
    }
  };


  const Register = async (data) => {
    const { username, email, password, role } = data;
    //console.log('Register:', { username, email, password, role });

    // Get access token
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("grant_type", "client_credentials");
      urlencoded.append("client_id", "admin-cli");
      urlencoded.append("client_secret", "rMNg8HPiPw8u81sL3geqswRl4G4S2aXt");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      const first_response = await fetch("http://localhost:8080/auth/realms/master/protocol/openid-connect/token", requestOptions)
      if (first_response.ok) {
        const adminAccessToken = await first_response.json();
        console.log(adminAccessToken)
        const token = adminAccessToken.access_token

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
        
        const register_user = await fetch("http://localhost:8080/auth/admin/realms/eshop/users", requestOptions)
        if (register_user.ok) {
          console.log("Registration Succesfull")
          //const user = await register_user.json();
          window.location.reload()
        } else {
          console.log("error")
        }
      } else {
        const error = await first_response.json();
        console.log(error)  
      }
    } catch (error) {
      console.log(error)
    }
    
  };


  //decode jwt access token when user login. Use this function
  function decodeJwt(jwtToken) {
    const base64Url = jwtToken.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace Base64 URL encoding characters
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    ); // Decode Base64 and handle URI component encoding
  
    return JSON.parse(jsonPayload);
  }

  return (
    
    <div className={styles.body}>
      <h2 className={styles.bigheader}>Cloud Computing App</h2>
      <div className={isRightPanelActive ? `${styles.container} ${styles.rightPanelActive}` : styles.container}>
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.f} action="#">
            <h1 className={styles.smallheader}>Create Account</h1>
            
            <input className={styles.i} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input className={styles.i} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input className={styles.i} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

            <div className={styles.checkbox}>
                <input className={styles.i}
                    type="checkbox"
                    id="sellerCheck"
                    checked={role === "Sellers"}
                    onChange={handleRoleChange}
                />
                <label htmlFor="sellerCheck">Seller</label>
            </div>

            <div className={styles.checkbox}>
                <input className={styles.i}
                    type="checkbox"
                    id="customerCheck"
                    checked={role === "Customers"}
                    onChange={handleRoleChange}
                />
                <label htmlFor="customerCheck">Customer</label>
            </div>
            <button className={styles.b} onClick={handleLoginSignup}>Sign Up</button>
          </form>
        </div>
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.f} action="#">
            <h1 className={styles.smallheader}>Sign in</h1>
            <input className={styles.i} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input className={styles.i} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className={styles.b} onClick={handleLoginSignup}>Sign In</button>
          </form>
        </div>
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className={styles.smallheader}>Welcome Back!</h1>
              <p className={styles.p}>If you already have an account click bellow to log in</p>
              <button className={styles.g} id="signIn" onClick={handleSignInClick}>Sign In</button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className={styles.smallheader}>Hello, Friend!</h1>
              <p className={styles.p}>Access to shop is restricted</p>
              <p2 className={styles.p2}>If you don't have an account click bellow to create one!</p2>
              <button className={styles.g} id="signUp" onClick={handleSignUpClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.f1}>
        <p className={styles.p}>
          Created <i className="fa fa-heart"></i> by{' '}
          <a className={styles.a} target="_blank" rel="noopener noreferrer" href="https://github.com/gsiatras">Georgios Michail Siatras</a>
          - Full stack e shop project for TUC Cloud Computing class{' '}
          <a className={styles.a} target="_blank" rel="noopener noreferrer" href="https://github.com/gsiatras/TUC_e-Shop">here</a>.
        </p>
      </footer>
    </div>
  );
};