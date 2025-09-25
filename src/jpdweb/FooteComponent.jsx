export default function FooterComponent() {
  return (
 <footer className="bg-[#D5EFFA] text-black w-full mt-auto relative z-10 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       
          <div>
            <h5 className="text-xl font-bold mb-2">About Us</h5>
            <p className="text-sm text-gray-700">
              Welcome to the home of the JPD learning web. Our mission is to support students studying Japanese with modern, interactive tools.
            </p>
          </div>

          <div>
            <h5 className="text-xl font-bold mb-2">Contact</h5>
            <p className="text-sm text-gray-700">Email: <a href="mailto:Mqnyle@gmail.com" className="text-blue-600 hover:underline">Mqnyle@gmail.com</a></p>
          </div>
        </div>

       
        <div className="my-6 border-t border-gray-300"></div>

 
        <p className="text-center text-sm text-gray-600">
          © 2025 Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  )
}