import React from 'react';

function Internships() {
  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Internship Opportunities</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Software Development Internship</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Join our team as a software development intern and gain hands-on experience
            working with cutting-edge technologies in a dynamic environment.
          </p>
          <button className="bg-blue-600 dark:bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors">
            Apply Now
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Data Science Internship</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Work with our data science team to analyze complex datasets and develop
            machine learning models for real-world applications.
          </p>
          <button className="bg-blue-600 dark:bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Internships;