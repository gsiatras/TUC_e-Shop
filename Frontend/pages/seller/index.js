import Layout from "@/components/seller/Layout";
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';

export default function SellerHome() {
  const [username, setUsername] = useState('seller1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = Cookies.get('username');
      setUsername(storedUsername || 'seller1');
    }
  }, []);

  
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{username}</b>
      </h2>

      <div className="flex bg-gray-300 gap-1 text-black rounded-lg">
        <span className="px-2">
          {username}
        </span>
      </div>
    </div>


  </Layout>
}
