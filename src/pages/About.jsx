import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, Globe, ChevronRight, Github, Linkedin, Instagram } from 'lucide-react';
import Sidh from '../assets/Sidh.jpg';
import Adron from '../assets/Adron.jpg';
import Lenny from '../assets/Lenny.jpg';
import Arindam from '../assets/Arindam.jpg';
import Ananya from '../assets/Ananya.jpg';
import Ashish from '../assets/AshishRanjan.jpg';
import Arpita from '../assets/Arpita.jpg';
import { supabase } from '../lib/supabaseClient.js'; // Make sure you import your Supabase client

const About = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [stats, setStats] = useState({
    clubsCount: 0,
    studentsCount: 0,
    eventsCount: 0,
    partnersCount: 20 // Keeping partners as static since there's no corresponding table
  });

  // Fetch counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Get clubs count
        const { count: clubsCount, error: clubsError } = await supabase
          .from('Clubs')
          .select('*', { count: 'exact', head: true });

        // Get profiles count (students)
        const { count: studentsCount, error: profilesError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get events count
        const { count: eventsCount, error: eventsError } = await supabase
          .from('Events')
          .select('*', { count: 'exact', head: true });

        if (clubsError) console.error('Error fetching clubs:', clubsError);
        if (profilesError) console.error('Error fetching profiles:', profilesError);
        if (eventsError) console.error('Error fetching events:', eventsError);

        setStats({
          clubsCount: clubsCount || 0,
          studentsCount: studentsCount || 0,
          eventsCount: eventsCount || 0,
          partnersCount: 20
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

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
        twitter: "https://instagram.com/sidhanthbibi"
      }
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
        twitter: "https://www.instagram.com/quadr1on/"
      }
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
        twitter: "https://www.instagram.com/lenny_dany_3/"
      }
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
        twitter: "https://www.instagram.com/thearindamjaiman"
      }
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
        twitter: "https://www.instagram.com/_aviana29/#"
      }
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
        twitter: "https://www.instagram.com/m_.one._y"
      }
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
        twitter: "https://www.instagram.com/aritaaaaas"
      }}
  ];

  const contactInfo = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Visit Us",
      content: "SRM University Vadapalani City Campus, Chennai, India",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "sb1051@srmist.edu.in",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "(+91) 7012081312",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Follow Us",
      content: "@VdpClubSphere",
      color: "from-green-400 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              About ClubSphere
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto px-4">
              Empowering student communities through innovation and collaboration
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Our Mission</h2>
            <p className="text-gray-400 text-lg">
              We're dedicated to creating a vibrant ecosystem where students can connect,
              collaborate, and grow together. Through innovative technology and community-driven
              initiatives, we're building the future of student engagement.
            </p>
            <button className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200">
              <span>Learn More</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg">
              <h3 className="text-4xl font-bold mb-2">{stats.clubsCount}+</h3>
              <p className="text-gray-200">Active Clubs</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-lg">
              <h3 className="text-4xl font-bold mb-2">{stats.studentsCount}+</h3>
              <p className="text-gray-200">Students</p>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-red-600 p-6 rounded-lg">
              <h3 className="text-4xl font-bold mb-2">{stats.eventsCount}+</h3>
              <p className="text-gray-200">Events</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-green-600 p-6 rounded-lg">
              <h3 className="text-4xl font-bold mb-2">{stats.partnersCount}+</h3>
              <p className="text-gray-200">Partners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group relative rounded-xl overflow-hidden"
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              <div className="aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-blue-400 mb-2">{member.role}</p>
                <p className={`text-gray-300 mb-4 transition-opacity duration-300 ${
                  hoveredMember === member.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  {member.bio}
                </p>
                <div className={`flex space-x-4 transition-opacity duration-300 ${
                  hoveredMember === member.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <a href={member.socials.github} target='_blank' className="text-gray-400 hover:text-white">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={member.socials.linkedin} target='_blank' className="text-gray-400 hover:text-white">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={member.socials.twitter}  target='_blank' className="text-gray-400 hover:text-white">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Get in Touch</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="group backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold">{info.title}</h3>
                <p className="text-gray-400">{info.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;