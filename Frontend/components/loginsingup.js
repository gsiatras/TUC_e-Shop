import { useState } from 'react';
import { useRouter } from "next/router";
import styles from '../styles/LoginSignup.module.css'; 
import Cookies from 'js-cookie';
import axios from 'axios';




export default function LoginSignup() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [action, setAction] = useState("Login");
  const [role, setRole] = useState('');
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setAccessTokenCookie = (token) => {
    console.log('dsa');
    Cookies.set('access_token', token, {expires: 7});
  };
  
  const setCookie = (data) => {
    // Destructure data
    const {uname, mail, rl, token} = data;
  
    // Set cookies
    //console.log('setting cookie to ' + rl);
    Cookies.set('username', uname, { expires: 7 });
    Cookies.set('email', mail, { expires: 7 });
    Cookies.set('role', rl, { expires: 7 });
    Cookies.set('access_token', token, { expires: 7 });
  };

  const handleSignUpClick = () => {
    setUsername("");
    setPassword("");
    setRole('');
    setIsRightPanelActive(true);
    setAction("Sign Up");
    //console.log(action);
  };

  const handleSignInClick = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setIsRightPanelActive(false);
    setAction("Login");
    //console.log(action);
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
        console.error(error);
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
    const res = await axios.post('/api/login?login='+true, data);
    //console.log(res);
    const ndata = res.data;
    setCookie(ndata);

    if (res.data.error === "invalid_grant") {
      alert("Wrong username or password!");
      return;
    }
    if (ndata.rl === "Seller") {
      router.push('/seller');  
    } else if (ndata.rl === "Customer") {
      router.push('/customer');
    }   
  };


  const Register = async (data) => {
    const { username, email, password, role } = data;
    const res = await axios.post('/api/login?register='+true, data);
    //console.log(res);
    if (res.statusText==="OK"){
      window.location.reload()
    }
    else {
      alert("Resigtration failed!");
      console.log(res);
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
      <h2 className={styles.bigheader}>TUCshop</h2>
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