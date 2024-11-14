import { create } from 'zustand';

const useViewModeStore = create((set) => ({
  viewMode: 'Personal', // Default mode
  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === 'Personal' ? 'Group' : 'Personal',
    })),
}));

export default useViewModeStore;
