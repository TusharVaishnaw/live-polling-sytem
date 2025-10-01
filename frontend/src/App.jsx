import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import WelcomeScreen from './components/WelcomeScreen';
import GetNameScreen from './components/GetNameScreen';
import StudentPolling from './components/StudentPolling';
import TeacherDashboard from './components/TeacherDashboard';

const API_URL = process.env.REACT_APP_API_URL;
const socket = io(API_URL);

function App() {
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');
  const [currentView, setCurrentView] = useState('welcome');
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollHistory, setPollHistory] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch participants whenever currentPoll changes
  useEffect(() => {
    if (currentPoll?._id) {
      fetchParticipants(currentPoll._id);
    } else {
      setParticipants([]);
    }
  }, [currentPoll]);

  useEffect(() => {
    // Fetch active poll on load
    fetchActivePoll();
    fetchPollHistory();

    // Socket listeners
    socket.on('pollUpdate', (poll) => {
      setCurrentPoll(poll);
      setHasVoted(false);
    });

    socket.on('voteUpdate', (data) => {
      if (currentPoll && currentPoll._id === data.pollId) {
        setCurrentPoll(prevPoll => ({
          ...prevPoll,
          options: prevPoll.options.map(opt =>
            opt._id === data.optionId 
              ? { ...opt, votes: opt.votes + 1 }
              : opt
          )
        }));
        
        // Fetch updated participants when someone votes
        fetchParticipants(data.pollId);
      }
    });

    socket.on('pollEnded', (poll) => {
      setPollHistory(prev => [poll, ...prev]);
      setCurrentPoll(null);
      setHasVoted(false);
      setParticipants([]);
    });

    socket.on('participantJoined', (participant) => {
      setParticipants(prev => {
        // Avoid duplicates
        if (prev.find(p => p.name === participant.name)) {
          return prev;
        }
        return [...prev, participant];
      });
    });

    // New listener for participant updates
    socket.on('participantsUpdate', (updatedParticipants) => {
      setParticipants(updatedParticipants);
    });

    return () => {
      socket.off('pollUpdate');
      socket.off('voteUpdate');
      socket.off('pollEnded');
      socket.off('participantJoined');
      socket.off('participantsUpdate');
    };
  }, [currentPoll]);

  const fetchActivePoll = async () => {
    try {
      const response = await fetch(`${API_URL}/api/polls/active`);
      const data = await response.json();
      if (data) setCurrentPoll(data);
    } catch (error) {
      console.error('Error fetching active poll:', error);
    }
  };

  const fetchPollHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/polls/history`);
      const data = await response.json();
      setPollHistory(data);
    } catch (error) {
      console.error('Error fetching poll history:', error);
    }
  };

  const fetchParticipants = async (pollId) => {
    try {
      const response = await fetch(`${API_URL}/api/polls/${pollId}/participants`);
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleUserTypeSelection = (type) => {
    setUserType(type);
    setCurrentView('getName');
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      socket.emit('userJoined', { name: userName, type: userType });
      setCurrentView(userType === 'teacher' ? 'teacherDashboard' : 'studentPolling');
    }
  };

  const handleCreatePoll = async (pollData) => {
    try {
      const response = await fetch(`${API_URL}/api/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pollData,
          createdBy: userName
        })
      });
      const poll = await response.json();
      socket.emit('createPoll', poll);
      setCurrentPoll(poll);
      setParticipants([]); // Reset participants for new poll
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  const handleVote = async (optionId) => {
    if (hasVoted || !currentPoll) return;

    try {
      const response = await fetch(`${API_URL}/api/polls/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pollId: currentPoll._id,
          optionId,
          userName
        })
      });

      if (response.ok) {
        socket.emit('vote', { pollId: currentPoll._id, optionId, userName });
        setHasVoted(true);
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleEndPoll = async () => {
    if (!currentPoll) return;

    try {
      const response = await fetch(`${API_URL}/api/polls/${currentPoll._id}/end`, {
        method: 'PATCH'
      });
      const endedPoll = await response.json();
      socket.emit('endPoll', endedPoll);
      setPollHistory([endedPoll, ...pollHistory]);
      setCurrentPoll(null);
      setParticipants([]);
    } catch (error) {
      console.error('Error ending poll:', error);
    }
  };

  if (currentView === 'welcome') {
    return <WelcomeScreen onSelectUserType={handleUserTypeSelection} />;
  }

  if (currentView === 'getName') {
    return (
      <GetNameScreen
        userType={userType}
        userName={userName}
        setUserName={setUserName}
        onSubmit={handleNameSubmit}
      />
    );
  }

  if (currentView === 'studentPolling') {
    return (
      <StudentPolling
        currentPoll={currentPoll}
        hasVoted={hasVoted}
        onVote={handleVote}
      />
    );
  }

  if (currentView === 'teacherDashboard') {
    return (
      <TeacherDashboard
        currentPoll={currentPoll}
        pollHistory={pollHistory}
        participants={participants}
        onCreatePoll={handleCreatePoll}
        onEndPoll={handleEndPoll}
      />
    );
  }

  return null;
}

export default App;
