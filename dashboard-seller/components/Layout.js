import Nav from '@/components/nav'

export default function Layout({children}) {
  return (
    <div className='bg-[#FF4B2B] min-h-screen flex'>
      <Nav />
      <div className='bg-white flex-grow mt-1 mr-1 mb-2 rounded-lg p-4'>
        {children}
      </div>
    </div>
  )
}