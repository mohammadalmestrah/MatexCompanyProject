import { motion } from 'framer-motion';
import { Shield, Scale, FileText, AlertCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="bg-indigo-900 dark:bg-gray-900 text-white px-8 py-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-indigo-200">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">1. Agreement to Terms</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  By accessing or using Matex's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
                </p>
              </section>

              {/* Services */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">2. Services</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Matex provides technology consulting, development, and project management services including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>Digital Transformation Solutions</li>
                  <li>Enterprise Software Development</li>
                  <li>AI and Machine Learning Integration</li>
                  <li>Mobile Application Development</li>
                  <li>UI/UX Design Services</li>
                  <li>Cloud Migration and Services</li>
                  <li>Cybersecurity Solutions</li>
                </ul>
              </section>

              {/* Project Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">3. Project Terms</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">3.1 Project Initiation</h3>
                  <p>
                    All projects begin with a formal agreement outlining scope, deliverables, timeline, and costs. Changes to project scope must be agreed upon in writing by both parties.
                  </p>

                  <h3 className="text-xl font-semibold">3.2 Payment Terms</h3>
                  <p>
                    Payment schedules will be outlined in individual project agreements. Standard terms include:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Initial deposit before project commencement</li>
                    <li>Milestone-based payments throughout the project</li>
                    <li>Final payment upon project completion</li>
                  </ul>

                  <h3 className="text-xl font-semibold">3.3 Intellectual Property</h3>
                  <p>
                    Upon full payment, clients receive full rights to custom deliverables. Matex retains rights to:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Underlying technologies and frameworks</li>
                    <li>Reusable components and modules</li>
                    <li>General knowledge and techniques developed</li>
                  </ul>
                </div>
              </section>

              {/* Client Responsibilities */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">4. Client Responsibilities</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>Clients agree to:</p>
                  <ul className="list-disc pl-6">
                    <li>Provide necessary access and information for project completion</li>
                    <li>Review and provide feedback in a timely manner</li>
                    <li>Maintain confidentiality of proprietary information</li>
                    <li>Make payments according to agreed schedules</li>
                  </ul>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">5. Limitation of Liability</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Matex shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services. Our liability is limited to the amount paid for the specific service in question.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">6. Termination</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Either party may terminate services with written notice. Upon termination:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
                  <li>Client shall pay for all services rendered up to termination date</li>
                  <li>Matex shall transfer all completed work to the client</li>
                  <li>Both parties shall maintain confidentiality obligations</li>
                </ul>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">7. Governing Law</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  These terms shall be governed by and construed in accordance with the laws of Lebanon, without regard to its conflict of law provisions.
                </p>
              </section>

              {/* Contact Information */}
              <section className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  For any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 text-gray-600 dark:text-gray-300">
                  <p>Email: contact@matexsolution.com</p>
                  <p>Phone: +961 76162549</p>
                  <p>Address: Lebanon</p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;