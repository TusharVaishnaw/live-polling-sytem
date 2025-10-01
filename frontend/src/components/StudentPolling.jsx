import React from 'react';
import { Send } from 'lucide-react';

export default function StudentPolling({ currentPoll, hasVoted, onVote }) {
  const [selectedOption, setSelectedOption] = React.useState(null);

  const handleSubmit = () => {
    if (selectedOption) {
      onVote(selectedOption);
    }
  };

  if (!currentPoll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Waiting for the teacher to start a poll...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium mb-2">
                🟢 Live Poll
              </span>
              <h2 className="text-2xl font-bold text-gray-900">Question</h2>
            </div>
          </div>

          <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
            <p className="font-medium">{currentPoll.question}</p>
          </div>

          {hasVoted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vote Submitted!</h3>
              <p className="text-gray-600">Wait for the teacher to ask a new question...</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {currentPoll.options.map((option) => (
                  <button
                    key={option._id}
                    onClick={() => setSelectedOption(option._id)}
                    className={`w-full text-left p-4 border-2 rounded-lg transition flex items-center gap-3 ${
                      selectedOption === option._id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option._id
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === option._id && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{option.text}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Submit Vote
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}