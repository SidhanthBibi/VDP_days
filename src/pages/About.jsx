import React from 'react';
import Sidh from '../assets/Sidh.jpg';
import Adron from '../assets/Adron.jpg';
import Lenny from '../assets/Lenny.jpg';
import { Building2, Mail, Phone, Globe } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sidhanth Bibi",
      role: "Developer",
      image: Sidh
    },
    {
      id: 2,
      name: "Adorn S George",
      role: "Developer",
      image: Adron
    },
    {
      id: 3,
      name: "Lenny Dany Derek",
      role: "Developer",
      image: Lenny
    }
  ];

  const contactInfo = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Visit Us",
      content: "SRM University Vadapalani City Campus, Chennai, India"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "UniClubs@university.edu"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "(+91) 904355XXXX"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Follow Us",
      content: "@UniClubs"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      {/* Neon Circle Accents */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          About Us
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Building a vibrant community through student-led initiatives
        </p>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90 rounded-xl"></div>
              <div className="bg-black absolute bottom-0 left-0 right-0 p-6 rounded-b-xl">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-blue-400">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="backdrop-blur-md bg-gray-900/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-[200ms]">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
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