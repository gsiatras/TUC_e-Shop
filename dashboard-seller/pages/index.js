import Layout from "@/components/Layout";
import { useEffect, useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('seller1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      setUsername(storedUsername || 'seller1');
    }
  }, []);

  console.log(localStorage);  
  return <Layout>
    <div className="text-[#FF4B2B] flex justify-between">
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
