import { useState } from 'react'
import axios from 'axios'

const TextQRGenerator = () => {
  const [text, setText] = useState('')
  const [qrCode, setQrCode] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [options, setOptions] = useState({
    width: 500,
    margin: 4,
    darkColor: '#000000',
    lightColor: '#FFFFFF',
    errorCorrectionLevel: 'M'
  })

  const generateQR = async () => {
    if (!text.trim()) {
      setError('Please enter some text')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('Sending request to /api/qr/text with:', { text, options });
      
      const response = await axios.post('/api/qr/text', {
        text,
        options
      }, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Response received:', response.status, response.data);

      if (response.data && response.data.success) {
        setQrCode(response.data.qrCode)
        console.log('QR code set successfully, length:', response.data.qrCode?.length);
      } else {
        setError('Failed to generate QR code - invalid response')
        console.error('Invalid response:', response.data);
      }
    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error request:', err.request);
      
      if (err.response) {
        // Server responded with error
        const errorMsg = err.response.data?.error || err.response.data?.details || 'Failed to generate QR code';
        setError(errorMsg);
        console.error('Server error:', err.response.status, errorMsg);
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Make sure the backend is running on port 5000.')
        console.error('No response received. Request:', err.request);
      } else {
        // Something else happened
        setError(err.message || 'Failed to generate QR code')
        console.error('Request setup error:', err.message);
      }
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = `qr-code-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text, URL, or any data..."
              className="input-field min-h-[120px] resize-none"
              rows="5"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Customization</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size: {options.width}px
              </label>
              <input
                type="range"
                min="200"
                max="1000"
                value={options.width}
                onChange={(e) => setOptions({ ...options, width: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margin: {options.margin}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={options.margin}
                onChange={(e) => setOptions({ ...options, margin: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dark Color
                </label>
                <input
                  type="color"
                  value={options.darkColor}
                  onChange={(e) => setOptions({ ...options, darkColor: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Light Color
                </label>
                <input
                  type="color"
                  value={options.lightColor}
                  onChange={(e) => setOptions({ ...options, lightColor: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Correction Level
              </label>
              <select
                value={options.errorCorrectionLevel}
                onChange={(e) => setOptions({ ...options, errorCorrectionLevel: e.target.value })}
                className="input-field"
              >
                <option value="L">L - Low (~7%)</option>
                <option value="M">M - Medium (~15%)</option>
                <option value="Q">Q - Quartile (~25%)</option>
                <option value="H">H - High (~30%)</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateQR}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate QR Code'
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="bg-white rounded-xl p-8 flex items-center justify-center min-h-[400px] border-2 border-dashed border-gray-200">
              {qrCode ? (
                <div className="text-center space-y-4 animate-fade-in">
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="mx-auto rounded-lg shadow-lg max-w-full"
                  />
                  <button
                    onClick={downloadQR}
                    className="btn-secondary w-full"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Download QR Code</span>
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-lg">Your QR code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextQRGenerator

