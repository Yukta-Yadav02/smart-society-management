import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, ArrowRight, UserCheck, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { WING_API, FLAT_API } from "../services/apis";

// fallback images (until backend image support)
import wingA from "../assets/images/wing-a.jpg";
import wingB from "../assets/images/wing-b.jpg";
import wingC from "../assets/images/wing-c.jpg";
import wingD from "../assets/images/wing-d.jpg";

const wingImages = [wingA, wingB, wingC, wingD];

const WingsLayout = () => {
  const [wings, setWings] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedWing, setSelectedWing] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  /* ================= FETCH WINGS ================= */
  useEffect(() => {
    const fetchWings = async () => {
      try {
        console.log("📡 Fetching wings from API...");
        setLoading(true);

        const res = await apiConnector("GET", WING_API.GET_ALL);
        console.log("✅ Wings API Response:", res);

        setWings(res.data || []);
      } catch (error) {
        console.error("❌ Error fetching wings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWings();
  }, []);

  /* ================= FETCH FLATS BY WING ================= */
  const handleWingSelect = async (wing) => {
    try {
      console.log(`📡 Fetching flats for Wing: ${wing.name}`);
      setSelectedWing(wing);
      setLoading(true);

      const res = await apiConnector("GET", FLAT_API.GET_BY_WING(wing._id));

      console.log("✅ Flats API Response:", res);
      setFlats(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching flats:", error);
    } finally {
      setLoading(false);
    }
  };

  
 const handleRequestAccess = (flat) => {
  console.log("➡️ Request access clicked:", flat);

  if (!user) {
    navigate("/signup");
  } else {
    navigate(
      `/request-access?flatId=${flat._id}&wing=${selectedWing.name}&flat=${flat.flatNumber}`
    );
  }
};

  return (
    <section id="wings" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between mb-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Explore Our Wings
            </h2>
            <p className="text-gray-500 text-lg">
              Discover Gokuldham Society layout
            </p>
          </div>

          {selectedWing && (
            <button
              onClick={() => {
                console.log("🔙 Back to wings");
                setSelectedWing(null);
                setFlats([]);
              }}
              className="text-primary-600 font-bold flex items-center gap-2"
            >
              <ArrowRight className="rotate-180" size={18} />
              Back
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center font-bold text-lg py-10">Loading...</div>
        )}

        <AnimatePresence mode="wait">
          {/* ================= WINGS ================= */}
          {!selectedWing && (
            <motion.div
              key="wings"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {wings.map((wing, index) => (
                <motion.div
                  key={wing._id}
                  whileHover={{ y: -10 }}
                  onClick={() => handleWingSelect(wing)}
                  className="cursor-pointer p-10 rounded-[3rem] border shadow-lg text-center"
                >
                  <img
                    src={wingImages[index % wingImages.length]}
                    alt={wing.name}
                    className="w-20 h-20 mx-auto mb-6 rounded-xl object-cover"
                  />
                  <h3 className="text-3xl font-black">Wing {wing.name}</h3>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ================= FLATS ================= */}
          {selectedWing && (
            <motion.div
              key="flats"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {flats.map((flat) => (
                <motion.div
                  key={flat._id}
                  className="p-6 border rounded-3xl shadow-lg"
                >
                  <span className="text-xs font-bold text-primary-500">
                    Flat
                  </span>

                  <h4 className="text-4xl font-black">{flat.flatNumber}</h4>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                      flat.isOccupied
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {flat.isOccupied ? "OCCUPIED" : "VACANT"}
                  </span>

                  <button
                    onClick={() => handleRequestAccess(flat)}
                    className={`mt-6 w-full py-3 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 ${
                      user
                        ? "bg-primary-600 text-white"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {user ? <UserCheck size={16} /> : <Lock size={16} />}
                    {user ? "Request Access" : "Sign Up"}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WingsLayout;
