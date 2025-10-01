import React from 'react';

export default function GetNameScreen({ userType, userName, setUserName, onSubmit }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            Let's Get Started
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {userType === 'teacher' 
              ? "You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time."
              : "Join the session and participate in live polls with your classmates."}
          </h1>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
            />
          </div>
          
          <button
            onClick={onSubmit}
            disabled={!userName.trim()}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}