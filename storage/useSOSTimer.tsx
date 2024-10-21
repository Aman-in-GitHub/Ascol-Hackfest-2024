import { create } from 'zustand';

type SOSTimerStoreType = {
  timeToSOS: number;
  setTimeToSOS: (value: number) => void;
  decrementTimeToSOS: () => void;
};

const useSOSTimerStore = create<SOSTimerStoreType>((set) => ({
  timeToSOS: 10,
  setTimeToSOS: (value: number) => set({ timeToSOS: value }),
  decrementTimeToSOS: () =>
    set((state) => ({ timeToSOS: Math.max(0, state.timeToSOS - 1) }))
}));

export default useSOSTimerStore;
