import React from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: 'Manoj Malipatil',
      role: 'Frontend Developer',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      bio: 'Experienced software engineer with a passion for creating innovative solutions. Specializes in AI/ML and full-stack development.',
      links: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'mailto:manoj@example.com',
        website: 'https://example.com'
      }
    },
    {
      name: 'Mayur Kumar',
      role: 'AI Engineer',
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
      bio: 'Technical architect with expertise in system design and cloud infrastructure. Passionate about building scalable solutions.',
      links: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'mailto:mayur@example.com',
        website: 'https://example.com'
      }
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              About InterviewPro
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Revolutionizing technical interviews through AI-powered simulation and personalized feedback
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            At InterviewPro, we're dedicated to helping developers succeed in their technical interviews. 
            Our platform combines cutting-edge AI technology with real-world interview scenarios to provide 
            a comprehensive learning experience that prepares candidates for success.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-600">
            The minds behind InterviewPro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col items-center">
                  <img
                    className="h-32 w-32 rounded-full object-cover"
                    src={member.image}
                    alt={member.name}
                  />
                  <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="mt-4 text-gray-600 text-center">{member.bio}</p>
                  
                  <div className="mt-6 flex space-x-4">
                    <a
                      href={member.links.github}
                      className="text-gray-600 hover:text-gray-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                    <a
                      href={member.links.linkedin}
                      className="text-gray-600 hover:text-gray-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                    <a
                      href={member.links.email}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Mail className="h-6 w-6" />
                    </a>
                    <a
                      href={member.links.website}
                      className="text-gray-600 hover:text-gray-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Innovation</h3>
              <p className="mt-2 text-gray-600">
                Pushing the boundaries of what's possible in interview preparation
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Accessibility</h3>
              <p className="mt-2 text-gray-600">
                Making quality interview preparation available to everyone
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Quality</h3>
              <p className="mt-2 text-gray-600">
                Delivering the highest standard of interview preparation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;