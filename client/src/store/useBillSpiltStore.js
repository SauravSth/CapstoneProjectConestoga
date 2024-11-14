import { create } from 'zustand';

const useBillSplitStore = create((set) => ({
  totalBill: 0,
  tipPercentage: 15,
  numberOfPeople: 1,
  setTotalBill: (bill) => set({ totalBill: bill }),
  setTipPercentage: (tip) => set({ tipPercentage: tip }),
  setNumberOfPeople: (people) => set({ numberOfPeople: people }),
}));

export default useBillSplitStore;
