import Logo from "../../images/Logo.png";
import Register from "../../components/CommonComponent/Registration";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="w-screen h-auto scroll-smooth">
      {/* Header */}
      <section className="bg-oklch(80.8% 0.114 19.571) w-screen h-16 flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center border-solid">
          <img src={Logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-3 gap-6">
          <a href="" className="text-shadow-2xs">
            Home
          </a>
          <a href="#about" className="text-shadow-2xs">
            About
          </a>
          <a href="#contact" className="text-shadow-2xs">
            Contact
          </a>
        </div>

        {/* Button login */}
   <Link to="/login">
  <button className="border border-black px-4 py-2 rounded-lg hover:bg-gray-200 hover:text-black transition">
    Login
  </button>
</Link>
      </section>

      {/* Hero Section */}
      <section
        className="w-screen h-[600px] flex items-center justify-center"
        style={{ backgroundColor: "oklch(20.8% 0.042 265.755)" }}
      >
        <div className="flex flex-col items-center text-center px-8">
          <h1 className="text-4xl text-white mb-6 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-120">
            Register for Admission 2025
          </h1>
          <p className="text-xl text-white mb-8 opacity-90">
            Join our vibrant community of learners.
          </p>
          <a
            href="#register"
            className="mt-4 px-6 py-4 border border-oklch(13% 0.028 261.692) text-white rounded-lg transition delay-150 duration-300 ease-in-out hover:-translate-y-1"
          >
            Register
          </a>
        </div>
      </section>

      {/* Registration Form */}
      <section
        id="register"
        className="w-screen h-auto bg-oklch(90.5% 0.093 164.15) border"
        style={{ borderColor: "oklch(44.6% 0.043 257.281)" }}
      >
        <Register />
      </section>

      {/* Footer */}
      <footer className="w-screen bg-black text-gray-300 mt-4 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + About */}
          <div id="about">
            <img src={Logo} alt="Logo" className="h-12 w-auto" />
            <h2 className="text-lg font-semibold">Student Management System</h2>
            <p className="text-sm text-gray-400 mt-2">
              Streamlining student success through smarter management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#register" className="hover:text-white">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Academic Programs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div id="contact">
            <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
            <p className="text-sm">📍 Team Codex</p>
            <p className="text-sm">Amity University</p>
            <p className="text-sm mt-2">📞 +91 8976587678</p>
            <p className="text-sm">✉️ sms@amity.edu</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4">
          © 2025 SMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
