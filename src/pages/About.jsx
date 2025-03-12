import React, { useState, useEffect } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Sidh from "../assets/Sidh.jpg";
import Adron from "../assets/Adron.jpg";
import Lenny from "../assets/Lenny.jpg";
import Arindam from "../assets/Arindam.jpg";
import Ananya from "../assets/Ananya.jpg";
import Ashish from "../assets/AshishRanjan.jpg";
import Arpita from "../assets/Arpita.jpg";
import { supabase } from "../lib/supabaseClient.js";

// A counter animation that scales duration based on value
const CounterAnimation = ({ value, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    // Only run the animation if we haven't animated yet, the element is in view, and we have a valid value
    if (inView && !hasAnimated && value > 0) {
      // Always explicitly reset to zero before starting animation
      setCount(0);

      // Base duration is 1000ms + value-dependent part
      // This makes larger numbers take longer to count
      // For example, if value is 20, duration is ~1400ms
      // If value is 350, duration is ~2750ms
      const baseDuration = 1000;
      const valueScale = 5; // ms per unit value
      const duration = Math.min(baseDuration + value * valueScale, 3000); // Cap at 3 seconds

      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);

      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);

        // Use easeOutQuart for a more dynamic feel
        const easeOutQuart = (t) => {
          return 1 - Math.pow(1 - t, 4);
        };

        setCount(Math.floor(easeOutQuart(progress) * value));

        if (frame === totalFrames) {
          clearInterval(counter);
          setCount(value); // Ensure we end exactly at the target value
          setHasAnimated(true);
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }
  }, [inView, value, hasAnimated]);

  return (
    <div ref={ref} className="inline-flex">
      <span className="text-4xl font-bold">{count}</span>
      <span className="text-4xl font-bold">{suffix}</span>
    </div>
  );
};

// StatCard component with motion effects
const StatCard = ({ gradient, value, label, isLoading }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView && !isLoading) {
      controls.start("visible");
    }
  }, [controls, inView, isLoading]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br ${gradient} p-6 rounded-lg`}
    >
      <h3 className="mb-2">
        {isLoading ? (
          <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <CounterAnimation value={value} />
        )}
      </h3>
      <p className="text-gray-200">{label}</p>
    </motion.div>
  );
};

const About = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    clubsCount: 0, // Initialize with 0 instead of default values
    studentsCount: 0,
    eventsCount: 0,
    partnersCount: 0,
  });

  // Animation controls for sections
  const missionControls = useAnimation();
  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      setStatsLoading(true); // Start loading
      try {
        // Get clubs count
        const { count: clubsCount, error: clubsError } = await supabase
          .from("Clubs")
          .select("*", { count: "exact", head: true });

        // Get profiles count (students)
        const { count: studentsCount, error: profilesError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Get events count
        const { count: eventsCount, error: eventsError } = await supabase
          .from("Events")
          .select("*", { count: "exact", head: true });

        if (clubsError) console.error("Error fetching clubs:", clubsError);
        if (profilesError)
          console.error("Error fetching profiles:", profilesError);
        if (eventsError) console.error("Error fetching events:", eventsError);

        // Set stats with actual values or fallbacks if errors occurred
        setStats({
          clubsCount: clubsCount || 25,
          studentsCount: studentsCount || 350,
          eventsCount: eventsCount || 42,
          partnersCount: 20,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
        // Set fallback values in case of error
        setStats({
          clubsCount: 25,
          studentsCount: 350,
          eventsCount: 42,
          partnersCount: 20,
        });
      } finally {
        setStatsLoading(false); // End loading regardless of success/failure
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    if (missionInView) {
      missionControls.start("visible");
    }
  }, [missionControls, missionInView]);

  const teamMembers = [
    {
      id: 1,
      name: "Sidhanth Bibi",
      role: "Team Lead",
      image: Sidh,
      bio: "Passionate about creating seamless user experiences",
      socials: {
        github: "https://github.com/sidhanthbibi",
        linkedin: "https://www.linkedin.com/in/sidhanthbibi/",
        twitter: "https://instagram.com/sidhanthbibi",
      },
    },
    {
      id: 2,
      name: "Adorn S George",
      role: "Lead Developer",
      image: Adron,
      bio: "Turning complex problems into elegant solutions",
      socials: {
        github: "https://github.com/Quadr1on",
        linkedin: "https://www.linkedin.com/in/adorn-s-george-1766202a9/",
        twitter: "https://www.instagram.com/quadr1on/",
      },
    },
    {
      id: 3,
      name: "Lenny Dany Derek",
      role: "Lead Developer",
      image: Lenny,
      bio: "Focusing on scalability and maintainability to help in building efficient and future-proof applications",
      socials: {
        github: "https://github.com/LennyDany-03",
        linkedin: "http://www.linkedin.com/in/lenny-dany-derek-d-4411aa326",
        twitter: "https://www.instagram.com/lenny_dany_3/",
      },
    },
    {
      id: 4,
      name: "Arindam Jaiman",
      role: "Lead Developer",
      image: Arindam,
      bio: "Building the future of student communities",
      socials: {
        github: "https://github.com/Mr-Jaiman09",
        linkedin: "https://www.linkedin.com/in/arindam-jaiman-6149a82ab/",
        twitter: "https://www.instagram.com/thearindamjaiman",
      },
    },
    {
      id: 5,
      name: "Ananya Jaiswal",
      role: "Developer",
      image: Ananya,
      bio: "Bringing creative ideas to life through code",
      socials: {
        github: "https://github.com/Ananya29J",
        linkedin: "https://www.linkedin.com/in/ananya-jaiswal-88a680328",
        twitter: "https://www.instagram.com/_aviana29/#",
      },
    },
    {
      id: 6,
      name: "Ashish Ranjan",
      role: "Designer",
      image: Ashish,
      bio: "Dedicated to crafting exceptional web experiences",
      socials: {
        github: "https://github.com/Money-gpt",
        linkedin: "https://www.linkedin.com/in/ashish-ranjan-670780322",
        twitter: "https://www.instagram.com/m_.one._y",
      },
    },
    {
      id: 7,
      name: "Arpita Biswal",
      role: "Designer",
      image: Arpita,
      bio: "Turning ideas into success with innovation and precision",
      socials: {
        github: "#",
        linkedin: "#",
        twitter: "https://www.instagram.com/aritaaaaas",
      },
    },
  ];

  const contactInfo = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Visit Us",
      content: "SRM University Vadapalani City Campus, Chennai, India",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "sb1051@srmist.edu.in",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "(+91) 6282483521",
      color: "from-pink-400 to-pink-600",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Follow Us",
      content: "@VdpClubSphere",
      color: "from-green-400 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Parallax Effect */}
      <motion.div
        className="relative h-96 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            className="text-center space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              About ClubSphere
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Empowering student communities through innovation and
              collaboration
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            ref={missionRef}
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate={missionControls}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold">Our Mission</h2>
            <p className="text-gray-400 text-lg">
              We're dedicated to creating a vibrant ecosystem where students can
              connect, collaborate, and grow together. Through innovative
              technology and community-driven initiatives, we're building the
              future of student engagement.
            </p>
            <motion.button
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Learn More</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              gradient="from-blue-500 to-purple-600"
              value={stats.clubsCount}
              label="Active Clubs"
              isLoading={statsLoading}
            />
            <StatCard
              gradient="from-purple-500 to-pink-600"
              value={stats.studentsCount}
              label="Students"
              isLoading={statsLoading}
            />
            <StatCard
              gradient="from-pink-500 to-red-600"
              value={stats.eventsCount}
              label="Events"
              isLoading={statsLoading}
            />
            <StatCard
              gradient="from-blue-600 to-green-600"
              value={stats.partnersCount}
              label="Partners"
              isLoading={statsLoading}
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="group relative rounded-xl overflow-hidden"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-90"></div>

              {/* Card content wrapper with transition */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-300 group-hover:translate-y-0">
                {/* Always visible content */}
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-blue-400 mb-2">{member.role}</p>

                {/* Expandable content */}
                <div
                  className="transition-all duration-300 overflow-hidden"
                  style={{
                    maxHeight: hoveredMember === member.id ? "200px" : "0px",
                    opacity: hoveredMember === member.id ? 1 : 0,
                  }}
                >
                  <p className="text-gray-300 mb-4">{member.bio}</p>
                  <div className="flex space-x-4">
                    <a
                      href={member.socials.github}
                      target="_blank"
                      className="text-gray-400 hover:text-white"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      className="text-gray-400 hover:text-white"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={member.socials.twitter}
                      target="_blank"
                      className="text-gray-400 hover:text-white"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <motion.h2
          className="text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get in Touch
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              className="group backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold">{info.title}</h3>
                <p className="text-gray-400">{info.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;