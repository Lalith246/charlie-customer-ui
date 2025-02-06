import React, { useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Bot } from 'lucide-react';
import useWebSocket from './useWebSocket'
import cvLogo from './../assets/cv_logo.jpg'

function App() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messageArray, setMessageArray] = useState<Array<{ text: string }>>([]);

  const { connect, disconnect } = useWebSocket("ws://localhost:8765");

  const handleCall = () => {
    setIsCallActive(!isCallActive);
    if (!isCallActive) {
      // Simulate AI response when call starts
      setTimeout(() => {
        setMessageArray([
          { text: "Hey there! Charlie here, I am here to assist you for all your queries related to Commvault." }
        ]);
      }, 1000);
      connect();
    } else {
      disconnect();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen flex items-center justify-items-center  bg-gradient-to-br from-customColor to-indigo-100 p-4">
      <div className="mx-auto w-1/4 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 p-6 text-black text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Charlie AI</h1>
          </div>
          <p className="text-indigo-600 text-sm">24/7 Customer Support</p>
        </div>

        {/* Call Status */}
        <div className="p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-12 h-12">
                <img src={cvLogo} alt="" className='bg-white' />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-500">
                {isCallActive ? 'In Call' : 'Available'}
              </p>
            </div>
          </div>

          {/* Call Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full ${
                isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              } hover:bg-opacity-80 transition-colors`}
              disabled={!isCallActive}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={handleCall}
              className={`p-4 rounded-full ${
                isCallActive
                  ? 'bg-red-600 text-white'
                  : 'bg-green-600 text-white'
              } hover:bg-opacity-80 transition-colors`}
            >
              {isCallActive ? (
                <PhoneOff className="w-6 h-6" />
              ) : (
                <Phone className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t text-center text-sm text-gray-500">
          {isCallActive ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Call in progress
            </span>
          ) : (
            'Click the phone button to start a call'
          )}
        </div>
      </div>
    </div>
  );
}

export default App;