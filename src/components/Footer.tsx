import { Twitter, Github, Linkedin } from 'lucide-react';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <img
                src="logo.png"
                alt="InterviewPro Logo"
                className="h-10 w-10 object-contain rounded-md bg-blue-500 p-1"
              />
              <span className="ml-2 text-xl font-bold text-white">InterviewPro</span>
            </div>
            <p className="mt-4 text-base text-gray-400">
              Prepare for your tech interview with our AI-powered simulator.
              Practice, get feedback, and land your dream job.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-6 mt-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Interview Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Role Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Practice Questions
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-base text-gray-400 text-center">
            &copy; 2025 InterviewPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
