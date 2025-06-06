import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Building2, MapPin, Clock, ChevronDown, ChevronUp, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';

const Careers = () => {
  const { t } = useTranslation();
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    type: 'job',
    resume: null as File | null,
    coverLetter: null as File | null,
    description: ''
  });

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const positions = {
    jobs: [
      {
        title: t('careers.positions.jobs.seniorEngineer.title'),
        department: t('careers.positions.jobs.seniorEngineer.department'),
        location: t('careers.positions.jobs.seniorEngineer.location'),
        type: t('careers.positions.jobs.seniorEngineer.type'),
        description: t('careers.positions.jobs.seniorEngineer.description'),
        requirements: t('careers.positions.jobs.seniorEngineer.requirements', { returnObjects: true }),
        technologies: t('careers.positions.jobs.seniorEngineer.technologies', { returnObjects: true }),
        responsibilities: t('careers.positions.jobs.seniorEngineer.responsibilities', { returnObjects: true })
      },
      {
        title: t('careers.positions.jobs.productManager.title'),
        department: t('careers.positions.jobs.productManager.department'),
        location: t('careers.positions.jobs.productManager.location'),
        type: t('careers.positions.jobs.productManager.type'),
        description: t('careers.positions.jobs.productManager.description'),
        requirements: t('careers.positions.jobs.productManager.requirements', { returnObjects: true }),
        technologies: t('careers.positions.jobs.productManager.technologies', { returnObjects: true }),
        responsibilities: t('careers.positions.jobs.productManager.responsibilities', { returnObjects: true })
      }
    ],
    internships: []
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    if (!formData.position) {
      setSubmitError('Please select a position');
      setSubmitting(false);
      return;
    }

    try {
      // Upload resume
      const resumeFile = formData.resume as File;
      const resumePath = `${Date.now()}_${resumeFile.name}`;
      const { error: resumeError, data: resumeData } = await supabase.storage
        .from('applications')
        .upload(resumePath, resumeFile);

      if (resumeError) throw resumeError;

      // Upload cover letter
      const coverFile = formData.coverLetter as File;
      const coverPath = `${Date.now()}_${coverFile.name}`;
      const { error: coverError, data: coverData } = await supabase.storage
        .from('applications')
        .upload(coverPath, coverFile);

      if (coverError) throw coverError;

      // Submit application
      const { error: submitError } = await supabase
        .from('job_applications')
        .insert({
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          application_type: formData.type,
          resume_url: resumeData.path,
          cover_letter_url: coverData.path,
          additional_info: formData.description,
          status: 'pending'
        });

      if (submitError) throw submitError;
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        type: 'job',
        resume: null,
        coverLetter: null,
        description: ''
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0]
      });
    }
  };

  const handleCancelFile = (fieldName: 'resume' | 'coverLetter') => {
    setFormData({
      ...formData,
      [fieldName]: null
    });
    if (fieldName === 'resume' && resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
    if (fieldName === 'coverLetter' && coverLetterInputRef.current) {
      coverLetterInputRef.current.value = '';
    }
  };

  const handlePositionClick = (title: string) => {
    setSelectedPosition(selectedPosition === title ? null : title);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">{t('careers.hero.title')}</h1>
            <p className="text-xl text-indigo-200 leading-relaxed">
              {t('careers.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Jobs Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-8">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold ml-4">{t('careers.positions.fullTime')}</h2>
            </div>
            <div className="space-y-6">
              {positions.jobs.map((job, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                    selectedPosition === job.title ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => handlePositionClick(job.title)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-gray-600">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span>{job.department}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      {selectedPosition === job.title ? (
                        <ChevronUp className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {selectedPosition === job.title && job.description && (
                    <motion.div 
                      className="px-6 pb-6 border-t border-gray-100 pt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-700 mb-6 leading-relaxed">{job.description}</p>
                      
                      <div className="space-y-6">
                        {job.requirements && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                            <ul className="space-y-2">
                              {(Array.isArray(job.requirements) ? job.requirements : []).map((req: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  className="flex items-start"
                                  whileHover={{ x: 5 }}
                                >
                                  <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-600">{req}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {job.technologies && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {(Array.isArray(job.technologies) ? job.technologies : []).map((tech: string, i: number) => (
                                <span 
                                  key={i}
                                  className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {job.responsibilities && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h4>
                            <ul className="space-y-2">
                              {job.responsibilities.map((resp: string, i: number) => (
                                <motion.li 
                                  key={i} 
                                  className="flex items-start"
                                  whileHover={{ x: 5 }}
                                >
                                  <ArrowRight className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-600">{resp}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Internships Section */}
          {positions.internships.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-8">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold ml-4">{t('careers.positions.internships')}</h2>
              </div>
              <div className="space-y-6">
                {positions.internships.map((internship, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md ${
                      selectedPosition === internship ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => handlePositionClick(internship)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{internship}</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-gray-600">
                              <Building2 className="h-4 w-4 mr-2" />
                              <span>{internship}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{internship}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{internship}</span>
                            </div>
                          </div>
                        </div>
                        {selectedPosition === internship ? (
                          <ChevronUp className="h-6 w-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Application Form */}
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">{t('careers.apply.title')}</h2>
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('careers.apply.success')}</h3>
                <p className="text-gray-600">{t('careers.apply.thankYou')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.apply.form.applicationType')}
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    >
                      <option value="job">{t('careers.apply.options.fullTime')}</option>
                      {positions.internships.length > 0 && (
                        <option value="internship">{t('careers.apply.options.internship')}</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.apply.form.position')}
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">{t('careers.apply.options.selectPosition')}</option>
                      {formData.type === 'job'
                        ? positions.jobs.map((job, index) => (
                            <option key={index} value={job.title}>
                              {job.title}
                            </option>
                          ))
                        : positions.internships.map((internship, index) => (
                            <option key={index} value={internship}>
                              {internship}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.apply.form.fullName')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.apply.form.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('careers.apply.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.apply.form.resume')}
                    </label>
                    <div className="relative">
                      <input
                        ref={resumeInputRef}
                        type="file"
                        name="resume"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        required
                      />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => resumeInputRef.current?.click()}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex-grow text-left"
                        >
                          {formData.resume ? formData.resume.name : 'Select the file'}
                        </button>
                        {formData.resume && (
                          <button
                            type="button"
                            onClick={() => handleCancelFile('resume')}
                            className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('careers.apply.form.coverLetter')}
                    </label>
                    <div className="relative">
                      <input
                        ref={coverLetterInputRef}
                        type="file"
                        name="coverLetter"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        required
                      />
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => coverLetterInputRef.current?.click()}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex-grow text-left"
                        >
                          {formData.coverLetter ? formData.coverLetter.name : 'Select the file'}
                        </button>
                        {formData.coverLetter && (
                          <button
                            type="button"
                            onClick={() => handleCancelFile('coverLetter')}
                            className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('careers.apply.form.additionalInfo')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    rows={4}
                    placeholder={t('careers.apply.form.placeholder')}
                  />
                </div>

                {submitError && (
                  <div className="text-red-600 text-sm">{submitError}</div>
                )}

                <motion.button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium text-lg flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span>{t('careers.apply.form.submitting')}</span>
                  ) : (
                    <>
                      {t('careers.apply.form.submit')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;