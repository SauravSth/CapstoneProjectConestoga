import { create } from 'zustand';

const useNavbarStore = create((set) => ({
  activePage: 'Overview',
  setActivePage: (page) => set({ activePage: page }),
}));

export default useNavbarStore;
