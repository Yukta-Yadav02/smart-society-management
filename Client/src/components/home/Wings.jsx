import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UserCheck, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnector";
import { WING_API, FLAT_API } from "../../services/apis";

//  COMMON UI COMPONENTS
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";

// fallback images (until backend image support)
import wingA from "../../assets/images/wing-a.jpg";
import wingB from "../../assets/images/wing-b.jpg";
import wingC from "../../assets/images/wing-c.jpg";
import wingD from "../../assets/images/wing-d.jpg";

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
        setLoading(true);
        const res = await apiConnector("GET", WING_API.GET_ALL);
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
      setSelectedWing(wing);
      setLoading(true);
      const res = await apiConnector("GET", FLAT_API.GET_BY_WING(wing._id));
      setFlats(res.data || []);
    } catch (error) {
      console.error("❌ Error fetching flats:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <section id="wings" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-50 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-4">
              Explore Our Wings
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Discover the layout and available units in Gokuldham Society.
            </p>
          </div>

          {selectedWing && (
            <button
              onClick={() => {
                setSelectedWing(null);
                setFlats([]);
              }}
              className="text-indigo-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
            >
              <ArrowLeft size={18} />
              Back to Wings
            </button>
          )}
        </div>

        {loading && <Loader size={48} className="py-20" />}

        {!loading && (
          <AnimatePresence mode="wait">
            {/* ================= WINGS ================= */}
            {!selectedWing ? (
              <motion.div
                key="wings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {wings.map((wing, index) => (
                  <Card
                    key={wing._id}
                    onClick={() => handleWingSelect(wing)}
                    className="p-10 text-center flex flex-col items-center"
                  >
                    <div className="w-24 h-24 mb-6 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                      <img
                        src={wingImages[index % wingImages.length]}
                        alt={wing.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Residential Zone</span>
                    <h3 className="text-3xl font-black text-slate-800">Wing {wing.name}</h3>
                  </Card>
                ))}
              </motion.div>
            ) : (
              /* ================= FLATS ================= */
              <motion.div
                key="flats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {flats.map((flat) => (
                  <Card key={flat._id} className="p-8 group shadow-xl shadow-slate-200/50">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Unit</span>
                        <h4 className="text-4xl font-black text-slate-800">{flat.flatNumber}</h4>
                      </div>
                      <Badge variant={flat.isOccupied ? 'default' : 'success'}>
                        {flat.isOccupied ? "OCCUPIED" : "VACANT"}
                      </Badge>
                    </div>

                    <Link
                      to={!user ? "/signup" : `/request-access?flatId=${flat._id}&wing=${selectedWing.name}&flat=${flat.flatNumber}`}
                      className="w-full block relative z-20"
                    >
                      <Button
                        fullWidth
                        variant={user ? 'primary' : 'secondary'}
                        className="py-4 flex items-center justify-center gap-2 group-hover:scale-105"
                      >
                        {user ? <UserCheck size={18} /> : <Lock size={18} />}
                        {user ? "Request Access" : "Sign Up"}
                      </Button>
                    </Link>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

    </section>
  );
};

export default WingsLayout;
