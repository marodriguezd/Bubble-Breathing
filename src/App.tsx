import React from 'react';
import './style.css';
import './translations.js';

import { SettingsProvider } from './contexts/SettingsContext';
import { SessionProvider, useSession } from './contexts/SessionContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { useBreathingTimer } from './hooks/useBreathingTimer';

import { Header } from './components/Header';
import { ConfigScreen } from './components/ConfigScreen';
import { ExerciseScreen } from './components/ExerciseScreen';
import { RetentionScreen } from './components/RetentionScreen';
import { RecoveryScreen } from './components/RecoveryScreen';
import { ResultsScreen } from './components/ResultsScreen';

import { SoundscapeManager } from './components/SoundscapeManager';

const MainApp = () => {
  const { phase } = useSession();
  
  // This hook needs to be mounted inside the providers to run the logic
  useBreathingTimer();

  return (
    <div className="container">
      <SoundscapeManager />
      <Header />
      {phase === 'idle' && <ConfigScreen />}
      {phase === 'breathing' && <ExerciseScreen />}
      {phase === 'retention' && <RetentionScreen />}
      {phase === 'recovery' && <RecoveryScreen />}
      {phase === 'finished' && <ResultsScreen />}
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <SessionProvider>
        <HistoryProvider>
          <MainApp />
        </HistoryProvider>
      </SessionProvider>
    </SettingsProvider>
  );
}

export default App;
