import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-100 to-white overflow-hidden">
      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 blur-xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-20 w-24 h-24 bg-purple-300 rounded-full opacity-40 blur-2xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 w-16 h-16 bg-green-200 rounded-full opacity-30 blur-xl"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-blue-600">NOVA</div>
          <Button variant="outline" onClick={() => navigate("/login")}>
            Login
          </Button>
        </nav> */}

        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            NOVA
          </motion.h1>
          <motion.p
            className="text-lg leading-8 text-gray-600 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            A comprehensive solution for managing college operations, from
            student applications to facility bookings, complaints, and more.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "📝",
              title: "Applications",
              desc: "Submit and track applications for events, budget requests, and more.",
            },
            {
              icon: "🏢",
              title: "Facility Booking",
              desc: "Book and manage college facilities with ease.",
            },
            {
              icon: "💰",
              title: "Budget Management",
              desc: "Track and manage budgets for various college activities.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
