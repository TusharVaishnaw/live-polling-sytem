import React, { useState } from 'react';
import { Plus, History, Users, BarChart3 } from 'lucide-react';

export default function TeacherDashboard({ 
  currentPoll, 
  pollHistory, 
  participants, 
  onCreatePoll, 
  onEndPoll 
}) {
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [showHistory, setShowHistory] = useState(false);
  const [participants, setParticipants] = useState([]);
  React.useEffect(() => {
    if (currentPoll?._id) {
      fetch(`/api/polls/${currentPoll._id}/participants`)
        .then(res => res.json())
        .then(data => setParticipants(data))
        .catch(err => console.error(err));
    }
  }, [currentPoll]);
  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const getTotalVotes = (poll) => {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const handleCreatePoll = () => {
    const validOptions = newOptions.filter(o => o.trim());
    if (!newQuestion.trim() || validOptions.length < 2) return;

    onCreatePoll({
      question: newQuestion,
      options: validOptions.map(text => ({ text, votes: 0 })),
      timer,
      isActive: true
    });

    setNewQuestion('');
    setNewOptions(['', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentPoll ? 'Active Poll' : 'Create New Poll'}
                </h2>
                <div className="flex gap-2">
                  {currentPoll && (
                    <button
                      onClick={onEndPoll}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                    >
                      End Poll
                    </button>
                  )}
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition flex items-center gap-2"
                  >
                    <History size={18} />
                    History
                  </button>
                </div>
              </div>

              {currentPoll ? (
                <>
                  <div className="bg-gray-800 text-white p-4 rounded-lg mb-6">
                    <p className="font-medium">{currentPoll.question}</p>
                  </div>

                  <div className="space-y-4">
                    {currentPoll.options.map((option) => {
                      const totalVotes = getTotalVotes(currentPoll);
                      const percentage = calculatePercentage(option.votes, totalVotes);
                      return (
                        <div key={option._id} className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              <span className="font-medium">{option.text}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-600">{option.votes} votes</span>
                              <span className="font-bold text-purple-600">{percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <BarChart3 size={18} />
                        <span>{getTotalVotes(currentPoll)} total votes</span>
                      </div>
                      <span className="text-green-600 font-medium">🟢 Poll is live</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poll Question
                    </label>
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="What is your question?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {newOptions.map((option, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const updated = [...newOptions];
                            updated[idx] = e.target.value;
                            setNewOptions(updated);
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Timer:</label>
                    <select
                      value={timer}
                      onChange={(e) => setTimer(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={30}>30 seconds</option>
                      <option value={60}>60 seconds</option>
                      <option value={90}>90 seconds</option>
                      <option value={120}>2 minutes</option>
                      <option value={300}>5 minutes</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCreatePoll}
                    disabled={!newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Create Poll
                  </button>
                </div>
              )}
            </div>

            {/* Poll History */}
            {showHistory && pollHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <History size={24} />
                  Poll History
                </h2>

                <div className="space-y-6">
                  {pollHistory.map((poll, idx) => {
                    const totalVotes = getTotalVotes(poll);
                    return (
                      <div key={poll._id || idx} className="pb-6 border-b last:border-b-0">
                        <h3 className="font-medium text-gray-800 mb-4">{poll.question}</h3>
                        <div className="space-y-3">
                          {poll.options.map((option, optIdx) => {
                            const percentage = calculatePercentage(option.votes, totalVotes);
                            return (
                              <div key={optIdx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                  <span>{option.text}</span>
                                </div>
                                <span className="font-bold">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{totalVotes} total votes</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Participants */}
          <div className="w-80">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-purple-600" />
                  <h3 className="font-bold text-gray-900">Participants</h3>
                </div>
                <div className="flex items-center gap-2 bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{participants.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                {participants.length > 0 ? (
                  participants.map((participant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{participant.name}</span>
                      {participant.voted && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Voted</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No participants yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
