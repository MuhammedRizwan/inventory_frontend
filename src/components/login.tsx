export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center p-5 md:p-20">
      <div className="flex w-full max-w-4xl shadow-2xl shadow-black border border-gray-300 rounded-lg overflow-hidden">

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full flex flex-col ">
            <div className="h-full flex flex-col justify-center items-center text-center p-6 w-full">
              <h1 className="text-black text-3xl font-bold">Welcome Back</h1>
              <p className="text-black mt-2">
                Sign in to continue your journey with us.
              </p>
            </div>
            <form className="w-full space-y-6">
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:outline-none shadow-md"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 shadow-md"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 min-h-[500px] bg-[url('/images/sign_in.webp')] bg-cover bg-center bg-no-repeat">
          <div className="h-full flex flex-col justify-center items-center text-center p-6 w-full bg-black/50">
            <h1 className="text-white text-3xl font-bold">Join With Us</h1>
            <p className="text-gray-300 m-2">
              Sign up with us we can grow up together.
            </p>
            <button className="border border-white px-3 rounded-sm">sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
