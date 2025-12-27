import { useState } from 'react'
import axios from 'axios'
import TextQRGenerator from './TextQRGenerator'
import ImageQRGenerator from './ImageQRGenerator'

const QRGenerator = () => {
  const [activeTab, setActiveTab] = useState('text')

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="text-center mb-8 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Create Stunning QR Codes
        </h2>
        <p className="text-gray-600 text-lg">
          Generate professional QR codes from text or embed your logo
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="glass-effect rounded-2xl p-2 mb-8 flex space-x-2 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            activeTab === 'text'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Text QR</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            activeTab === 'image'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Image QR</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-2xl">
        {activeTab === 'text' ? <TextQRGenerator /> : <ImageQRGenerator />}
      </div>
    </div>
  )
}

export default QRGenerator

