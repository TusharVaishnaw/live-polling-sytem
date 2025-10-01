import React from 'react';

export default function WelcomeScreen({ onSelectUserType }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Interactive Poll
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to the Live Polling System
          </h1>
          <p className="text-gray-600">
            Please select the role that best describes you to begin using the live polling system
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => onSelectUserType('student')}
            className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition text-left"
          >
            <h3 className="font-semibold text-lg mb-2">I'm a Student</h3>
            <p className="text-gray-600 text-sm">
              Join a live poll session and submit your answers in real-time.
            </p>
          </button>
          
          <button
            onClick={() => onSelectUserType('teacher')}
            className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition text-left"
          >
            <h3 className="font-semibold text-lg mb-2">I'm a Teacher</h3>
            <p className="text-gray-600 text-sm">
              Create polls, view live results, and manage your sessions.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}