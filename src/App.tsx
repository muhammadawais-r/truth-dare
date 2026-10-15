import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Player, PromptItem, PromptType, ListMode, 
  ScreenState, GameSettings, PlayerScore, PLAYER_COLORS, WildcardPrompt 
} from './types/game';
import { 
  loadSavedTruths, saveTruths, loadSavedDares, saveDares, 
  loadSavedPlayerNames, savePlayerNames, loadSettings, 
  saveSettings, clearSavedQuestions 
} from './utils/storage';
import { sounds } from './utils/audio';
import { WILDCARD_LIBRARY, drawSixWildcards } from './utils/wildcardLibrary';

import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { PlayerSetupScreen } from './components/PlayerSetupScreen';
import { QuestionManagerScreen } from './components/QuestionManagerScreen';
import { SpinnerScreen } from './components/SpinnerScreen';
import { ChoiceScreen } from './components/ChoiceScreen';
import { PromptDisplayScreen } from './components/PromptDisplayScreen';
import { WildcardScreen } from './components/WildcardScreen';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const [isGameSetupFlow, setIsGameSetupFlow] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [confirmQuitModal, setConfirmQuitModal] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  // Synchronize audio sound setting
  useEffect(() => {
    sounds.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    sounds.enabled = next;
    if (next) sounds.playWinChime();
    handleUpdateSettings({ ...settings, soundEnabled: next });
  };

  // Players State (2-10 players)
  const [players, setPlayers] = useState<Player[]>(() => {
    const savedNames = loadSavedPlayerNames();
    const count = savedNames.length >= 2 && savedNames.length <= 10 ? savedNames.length : 4;
    return Array.from({ length: count }, (_, i) => {
      const colorPair = PLAYER_COLORS[i % PLAYER_COLORS.length];
      return {
        id: `p_${i + 1}`,
        name: savedNames[i] || `Player ${i + 1}`,
        color: colorPair.color,
        accentColor: colorPair.accentColor,
      };
    });
  });

  const handleUpdatePlayers = (updated: Player[]) => {
    setPlayers(updated);
    savePlayerNames(updated);
  };

  // Truth & Dare Storage Mode
  const [listMode, setListMode] = useState<ListMode>('saved');

  // Question & Dare Lists
  const [savedTruths, setSavedTruths] = useState<PromptItem[]>(() => loadSavedTruths());
  const [savedDares, setSavedDares] = useState<PromptItem[]>(() => loadSavedDares());

  // Active game working lists (can be saved or temporary)
  const [activeTruths, setActiveTruths] = useState<PromptItem[]>(() => loadSavedTruths());
  const [activeDares, setActiveDares] = useState<PromptItem[]>(() => loadSavedDares());

  // Sync to saved storage only when in 'saved' mode
  const handleUpdateTruths = (items: PromptItem[]) => {
    setActiveTruths(items);
    if (listMode === 'saved') {
      setSavedTruths(items);
      saveTruths(items);
    }
  };

  const handleUpdateDares = (items: PromptItem[]) => {
    setActiveDares(items);
    if (listMode === 'saved') {
      setSavedDares(items);
      saveDares(items);
    }
  };

  const handleSetListMode = (mode: ListMode) => {
    setListMode(mode);
    if (mode === 'saved') {
      // If switching to saved, persist current active lists
      setSavedTruths(activeTruths);
      saveTruths(activeTruths);
      setSavedDares(activeDares);
      saveDares(activeDares);
    }
  };

  const handleLoadSavedLists = () => {
    const truths = loadSavedTruths();
    const dares = loadSavedDares();
    setActiveTruths(truths);
    setActiveDares(dares);
    setListMode('saved');
  };

  const handleClearSavedLists = () => {
    clearSavedQuestions();
    setSavedTruths([]);
    setSavedDares([]);
    if (listMode === 'saved') {
      setActiveTruths([]);
      setActiveDares([]);
    }
  };

  // Active Game State
  const [inGame, setInGame] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [currentPromptType, setCurrentPromptType] = useState<PromptType | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<PromptItem | null>(null);
  const [unusedTruthIds, setUnusedTruthIds] = useState<string[]>([]);
  const [unusedDareIds, setUnusedDareIds] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, PlayerScore>>({});

  // Wildcard Deck Tracking
  const [usedWildcardIds, setUsedWildcardIds] = useState<string[]>([]);
  const [currentWildcardCards, setCurrentWildcardCards] = useState<WildcardPrompt[]>([]);
  const [isWildcardDeckExhausted, setIsWildcardDeckExhausted] = useState(false);

  // Helper to pick next randomized prompt from list avoiding immediate repetition
  const pickNextPrompt = useCallback((
    type: PromptType, 
    currentId?: string
  ): PromptItem | null => {
    const list = type === 'truth' ? activeTruths : activeDares;
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];

    let pool = type === 'truth' ? [...unusedTruthIds] : [...unusedDareIds];

    // If pool is empty or only contains current item, refill pool with all items except current
    if (pool.length === 0 || (pool.length === 1 && pool[0] === currentId)) {
      pool = list.map(item => item.id).filter(id => id !== currentId);
    }

    // Pick uniform random item from remaining pool
    const randomIdx = Math.floor(Math.random() * pool.length);
    const chosenId = pool[randomIdx];

    // Update remaining pool
    const newPool = pool.filter((_, idx) => idx !== randomIdx);
    if (type === 'truth') {
      setUnusedTruthIds(newPool);
    } else {
      setUnusedDareIds(newPool);
    }

    const found = list.find(item => item.id === chosenId);
    return found || list[0];
  }, [activeTruths, activeDares, unusedTruthIds, unusedDareIds]);

  // Start Game Handler
  const handleStartGame = () => {
    // Reset shuffle pools
    setUnusedTruthIds(activeTruths.map(i => i.id));
    setUnusedDareIds(activeDares.map(i => i.id));
    setUsedWildcardIds([]);

    // Reset scores for participating players
    const initialScores: Record<string, PlayerScore> = {};
    players.forEach(p => {
      initialScores[p.id] = { completed: 0, skipped: 0 };
    });
    setScores(initialScores);

    setSelectedPlayerIndex(null);
    setCurrentPromptType(null);
    setCurrentPrompt(null);
    setInGame(true);
    setCurrentScreen('SPINNER');
  };

  // Spinner selects a player
  const handlePlayerSelected = (playerIndex: number) => {
    setSelectedPlayerIndex(playerIndex);
    setCurrentScreen('CHOICE');
  };

  // Player chooses Truth, Dare, or Wildcard
  const handleSelectChoice = (type: PromptType) => {
    setCurrentPromptType(type);

    if (type === 'wildcard') {
      const { cards, isDeckExhausted } = drawSixWildcards(new Set(usedWildcardIds));
      setCurrentWildcardCards(cards);
      setIsWildcardDeckExhausted(isDeckExhausted);
      setCurrentScreen('WILDCARD_SELECT');
      return;
    }

    const chosenPrompt = pickNextPrompt(type);
    if (chosenPrompt) {
      setCurrentPrompt(chosenPrompt);
      setCurrentScreen('PROMPT_DISPLAY');
    }
  };

  // Card is revealed in Wildcard mode
  const handleWildcardRevealed = (prompt: WildcardPrompt) => {
    setUsedWildcardIds(prev => {
      if (prev.includes(prompt.id)) return prev;
      return [...prev, prompt.id];
    });
  };

  // Reset Wildcard deck history manually
  const handleResetWildcardHistory = () => {
    setUsedWildcardIds([]);
    const { cards, isDeckExhausted } = drawSixWildcards(new Set());
    setCurrentWildcardCards(cards);
    setIsWildcardDeckExhausted(isDeckExhausted);
  };

  // Player requests "Change Question" or "Change Dare"
  const handleChangePrompt = () => {
    if (!currentPromptType || !currentPrompt) return;
    const alternative = pickNextPrompt(currentPromptType, currentPrompt.id);
    if (alternative) {
      setCurrentPrompt(alternative);
    }
  };

  // Player completes or skips turn -> advance to next spin
  const handleNextTurn = (completed: boolean) => {
    if (selectedPlayerIndex !== null && players[selectedPlayerIndex]) {
      const pId = players[selectedPlayerIndex].id;
      setScores(prev => {
        const cur = prev[pId] || { completed: 0, skipped: 0 };
        return {
          ...prev,
          [pId]: {
            completed: cur.completed + (completed ? 1 : 0),
            skipped: cur.skipped + (!completed ? 1 : 0),
          }
        };
      });
    }

    // Advance back to spinner
    setSelectedPlayerIndex(null);
    setCurrentPromptType(null);
    setCurrentPrompt(null);
    setCurrentScreen('SPINNER');
  };

  // Exit game to home screen
  const handleConfirmExitGame = () => {
    setInGame(false);
    setSelectedPlayerIndex(null);
    setCurrentPromptType(null);
    setCurrentPrompt(null);
    setConfirmQuitModal(false);
    setCurrentScreen('HOME');
  };

  const selectedPlayer = selectedPlayerIndex !== null ? players[selectedPlayerIndex] : null;

  const hasAlternativePrompt = useMemo(() => {
    if (!currentPromptType) return false;
    const list = currentPromptType === 'truth' ? activeTruths : activeDares;
    return list.length > 1;
  }, [currentPromptType, activeTruths, activeDares]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-white">
      {/* Top Bar Contract compliant navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setIsGameSetupFlow(false);
          setCurrentScreen(screen);
        }}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSettings={() => setShowSettingsModal(true)}
        inGame={inGame}
        onConfirmQuitGame={() => setConfirmQuitModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6">
        {currentScreen === 'HOME' && (
          <HomeScreen
            onPlayNow={() => {
              setIsGameSetupFlow(true);
              setCurrentScreen('PLAYER_SETUP');
            }}
            onManageQuestions={() => {
              setIsGameSetupFlow(false);
              setCurrentScreen('QUESTION_MANAGER');
            }}
            savedTruthCount={savedTruths.length}
            savedDareCount={savedDares.length}
          />
        )}

        {currentScreen === 'PLAYER_SETUP' && (
          <PlayerSetupScreen
            players={players}
            onUpdatePlayers={handleUpdatePlayers}
            onContinue={() => {
              setIsGameSetupFlow(true);
              setCurrentScreen('QUESTION_MANAGER');
            }}
            onBack={() => {
              setIsGameSetupFlow(false);
              setCurrentScreen('HOME');
            }}
          />
        )}

        {currentScreen === 'QUESTION_MANAGER' && (
          <QuestionManagerScreen
            truthList={activeTruths}
            dareList={activeDares}
            listMode={listMode}
            onUpdateTruths={handleUpdateTruths}
            onUpdateDares={handleUpdateDares}
            onSetListMode={handleSetListMode}
            onStartGame={handleStartGame}
            onBack={() => {
              if (isGameSetupFlow) {
                setCurrentScreen('PLAYER_SETUP');
              } else {
                setCurrentScreen('HOME');
              }
            }}
            isGameSetupFlow={isGameSetupFlow}
            hasSavedLists={savedTruths.length > 0 || savedDares.length > 0}
            onLoadSavedLists={handleLoadSavedLists}
          />
        )}

        {currentScreen === 'SPINNER' && (
          <SpinnerScreen
            players={players}
            onPlayerSelected={handlePlayerSelected}
            reducedMotion={settings.reducedMotion}
            soundEnabled={settings.soundEnabled}
          />
        )}

        {currentScreen === 'CHOICE' && selectedPlayer && (
          <ChoiceScreen
            player={selectedPlayer}
            onSelectChoice={handleSelectChoice}
            truthCount={activeTruths.length}
            dareCount={activeDares.length}
            wildcardRemainingCount={Math.max(0, WILDCARD_LIBRARY.length - usedWildcardIds.length)}
          />
        )}

        {currentScreen === 'WILDCARD_SELECT' && selectedPlayer && (
          <WildcardScreen
            player={selectedPlayer}
            cards={currentWildcardCards}
            revealedCount={usedWildcardIds.length}
            totalLibraryCount={WILDCARD_LIBRARY.length}
            isDeckExhausted={isWildcardDeckExhausted}
            onCardRevealed={handleWildcardRevealed}
            onNextTurn={handleNextTurn}
            onResetDeckHistory={handleResetWildcardHistory}
            keepScore={settings.keepScore}
          />
        )}

        {currentScreen === 'PROMPT_DISPLAY' && selectedPlayer && currentPromptType && currentPrompt && (
          <PromptDisplayScreen
            player={selectedPlayer}
            promptType={currentPromptType}
            currentPrompt={currentPrompt}
            promptList={currentPromptType === 'truth' ? activeTruths : activeDares}
            totalPromptsCount={currentPromptType === 'truth' ? activeTruths.length : activeDares.length}
            hasAlternativePrompt={hasAlternativePrompt}
            onChangePrompt={handleChangePrompt}
            onNextTurn={handleNextTurn}
            keepScore={settings.keepScore}
          />
        )}
      </main>

      {/* Settings & Scoreboard Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClearSavedLists={handleClearSavedLists}
        onExitToHome={handleConfirmExitGame}
        inGame={inGame}
        players={players}
        scores={scores}
      />

      {/* Confirm Quit Game Modal */}
      {confirmQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">End Current Game?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to exit to the home screen? Your current game session and turn history will end.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmQuitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
              >
                Keep Playing
              </button>
              <button
                onClick={handleConfirmExitGame}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl cursor-pointer"
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
