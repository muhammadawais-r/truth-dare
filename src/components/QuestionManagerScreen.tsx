import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Check, X, Sparkles, 
  ArrowRight, ArrowLeft, AlertCircle, Save, Clock,
  FileQuestion, Flame, RefreshCw
} from 'lucide-react';
import { PromptItem, PromptType, ListMode } from '../types/game';
import { sounds } from '../utils/audio';
import { createPromptItem, SAMPLE_TRUTHS, SAMPLE_DARES } from '../utils/samplePrompts';

interface QuestionManagerScreenProps {
  truthList: PromptItem[];
  dareList: PromptItem[];
  listMode: ListMode;
  onUpdateTruths: (items: PromptItem[]) => void;
  onUpdateDares: (items: PromptItem[]) => void;
  onSetListMode: (mode: ListMode) => void;
  onStartGame?: () => void;
  onBack: () => void;
  isGameSetupFlow: boolean;
  hasSavedLists: boolean;
  onLoadSavedLists: () => void;
}

export const QuestionManagerScreen: React.FC<QuestionManagerScreenProps> = ({
  truthList,
  dareList,
  listMode,
  onUpdateTruths,
  onUpdateDares,
  onSetListMode,
  onStartGame,
  onBack,
  isGameSetupFlow,
  hasSavedLists,
  onLoadSavedLists
}) => {
  const [activeTab, setActiveTab] = useState<PromptType>('truth');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: PromptType } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const currentList = activeTab === 'truth' ? truthList : dareList;
  const updateCurrentList = (newList: PromptItem[]) => {
    if (activeTab === 'truth') {
      onUpdateTruths(newList);
    } else {
      onUpdateDares(newList);
    }
  };

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newText.trim();
    if (!trimmed) {
      setValidationError(`Please enter a valid ${activeTab === 'truth' ? 'question' : 'challenge'}.`);
      sounds.playButtonTap();
      return;
    }

    const newItem = createPromptItem(trimmed);
    updateCurrentList([newItem, ...currentList]);
    setNewText('');
    setValidationError(null);
    sounds.playButtonTap();
  };

  const handleStartEdit = (item: PromptItem) => {
    sounds.playButtonTap();
    setEditingId(item.id);
    setEditText(item.text);
    setValidationError(null);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (!trimmed) {
      setValidationError('Text cannot be empty.');
      sounds.playButtonTap();
      return;
    }

    const updated = currentList.map(item => 
      item.id === editingId ? { ...item, text: trimmed } : item
    );
    updateCurrentList(updated);
    setEditingId(null);
    setEditText('');
    setValidationError(null);
    sounds.playButtonTap();
  };

  const handleCancelEdit = () => {
    sounds.playButtonTap();
    setEditingId(null);
    setEditText('');
    setValidationError(null);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    sounds.playButtonTap();
    if (itemToDelete.type === 'truth') {
      onUpdateTruths(truthList.filter(item => item.id !== itemToDelete.id));
    } else {
      onUpdateDares(dareList.filter(item => item.id !== itemToDelete.id));
    }
    setItemToDelete(null);
  };

  const handleAddSamplePrompts = () => {
    sounds.playButtonTap();
    const samples = activeTab === 'truth' ? SAMPLE_TRUTHS : SAMPLE_DARES;
    const newItems = samples.slice(0, 5).map(text => createPromptItem(text));
    updateCurrentList([...currentList, ...newItems]);
    setValidationError(null);
  };

  const handleValidateAndStart = () => {
    if (truthList.length === 0 && dareList.length === 0) {
      setValidationError('Please add at least one Truth question and one Dare challenge before starting.');
      sounds.playButtonTap();
      return;
    }
    if (truthList.length === 0) {
      setValidationError('Please add at least one Truth question so players who choose Truth have a prompt.');
      setActiveTab('truth');
      sounds.playButtonTap();
      return;
    }
    if (dareList.length === 0) {
      setValidationError('Please add at least one Dare challenge so players who choose Dare have a prompt.');
      setActiveTab('dare');
      sounds.playButtonTap();
      return;
    }

    sounds.playButtonTap();
    if (onStartGame) {
      onStartGame();
    }
  };

  return (
    <div className="py-6 sm:py-10 px-4 max-w-3xl mx-auto w-full">
      {/* Header with Back button and Status */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sounds.playButtonTap();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isGameSetupFlow ? 'Back to Players' : 'Back to Home'}</span>
        </button>

        {isGameSetupFlow && (
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Step 2 of 2 · Questions
          </span>
        )}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Manage Questions & Dares
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Add and refine your custom questions and challenges for the game.
        </p>
      </div>

      {/* Storage Mode Selector Card */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-sm font-bold text-white block">Storage Mode</span>
            <span className="text-xs text-slate-400">
              {listMode === 'saved' 
                ? 'Changes are automatically saved to your browser for future sessions.' 
                : 'Session only. Your list is kept in memory and won’t overwrite saved lists.'}
            </span>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800/80 self-start sm:self-auto">
            <button
              onClick={() => {
                sounds.playButtonTap();
                onSetListMode('saved');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                listMode === 'saved'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Saved Mode</span>
            </button>

            <button
              onClick={() => {
                sounds.playButtonTap();
                onSetListMode('temporary');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                listMode === 'temporary'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Temporary</span>
            </button>
          </div>
        </div>

        {/* Existing saved collection notice if currently in temporary mode */}
        {listMode === 'temporary' && hasSavedLists && (
          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
            <span>You have existing permanently saved lists available.</span>
            <button
              onClick={() => {
                sounds.playButtonTap();
                onLoadSavedLists();
              }}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
            >
              Load Saved Lists
            </button>
          </div>
        )}
      </div>

      {/* Tabs: Truth vs Dare */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('truth');
            setEditingId(null);
            setValidationError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'truth'
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileQuestion className="w-4 h-4 text-cyan-400" />
          <span>Truth Questions</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 font-mono text-slate-300">
            {truthList.length}
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playButtonTap();
            setActiveTab('dare');
            setEditingId(null);
            setValidationError(null);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'dare'
              ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Flame className="w-4 h-4 text-pink-400" />
          <span>Dare Challenges</span>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-800 font-mono text-slate-300">
            {dareList.length}
          </span>
        </button>
      </div>

      {/* Validation Message */}
      {validationError && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Add New Item Input */}
      <form onSubmit={handleAddItem} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => {
              setNewText(e.target.value);
              setValidationError(null);
            }}
            placeholder={
              activeTab === 'truth'
                ? "Type a Truth question (e.g., What is your biggest guilty pleasure?)"
                : "Type a Dare challenge (e.g., Do your best impression of another player)"
            }
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
          />

          <button
            type="submit"
            className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer ${
              activeTab === 'truth'
                ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                : 'bg-pink-600 hover:bg-pink-500 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'truth' ? 'Truth' : 'Dare'}</span>
          </button>
        </div>

        {/* Quick Sample Inspiration Button */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
          <span>{currentList.length} total items in this list</span>
          <button
            type="button"
            onClick={handleAddSamplePrompts}
            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Need inspiration? Add 5 samples</span>
          </button>
        </div>
      </form>

      {/* List of Items */}
      <div className="space-y-2 mb-8 max-h-[380px] overflow-y-auto pr-1">
        {currentList.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
            <p className="text-sm font-medium text-slate-400">
              No {activeTab === 'truth' ? 'truth questions' : 'dare challenges'} in this list yet.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Type your own custom question above or click &ldquo;Add 5 samples&rdquo; for ideas.
            </p>
          </div>
        ) : (
          currentList.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start justify-between gap-3 transition-colors hover:border-slate-700/80"
            >
              {editingId === item.id ? (
                /* Inline Edit Mode */
                <div className="flex-1 space-y-2">
                  <textarea
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Regular Display Mode */
                <>
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className="text-xs font-mono text-slate-500 pt-0.5 shrink-0">
                      #{index + 1}
                    </span>
                    <p className="text-sm text-slate-200 leading-snug break-words">
                      {item.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(item)}
                      title="Edit prompt"
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setItemToDelete({ id: item.id, type: activeTab })}
                      title="Delete prompt"
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Prompt?</h3>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this {itemToDelete.type === 'truth' ? 'Truth question' : 'Dare challenge'}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Game or Continue Bar */}
      {isGameSetupFlow ? (
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              sounds.playButtonTap();
              onBack();
            }}
            className="flex-1 px-5 py-3 text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Back
          </button>

          <button
            onClick={handleValidateAndStart}
            className="flex-2 flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 active:scale-[0.98] rounded-xl shadow-lg shadow-indigo-900/30 transition-all cursor-pointer"
          >
            <span>Start Game</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playButtonTap();
              onBack();
            }}
            className="px-6 py-2.5 text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};
