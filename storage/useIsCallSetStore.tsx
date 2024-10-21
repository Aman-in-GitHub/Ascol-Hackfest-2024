// import { create } from 'zustand';

// type callSetStoreType = {
//   isCallSet: boolean;
//   timeToCall: number;
//   callerId: string;
//   setCallerId: (value: string) => void;
//   setIsCallSet: (value: boolean) => void;
//   resetTimeToCall: () => void;
// };

// const useIsCallSetStore = create<callSetStoreType>((set) => ({
//   isCallSet: false,
//   timeToCall: 0,
//   callerId: '',
//   setCallerId: (value: string) => set({ callerId: value }),
//   setIsCallSet: (value: boolean) => set({ isCallSet: value }),
//   resetTimeToCall: () => set({ timeToCall: 0 })
// }));

// export default useIsCallSetStore;

import { create } from 'zustand';

type CallSetStoreType = {
  isCallSet: boolean;
  timeToCall: number;
  callerId: string;
  setCallerId: (value: string) => void;
  setIsCallSet: (value: boolean) => void;
  setTimeToCall: (value: number) => void;
  decrementTimeToCall: () => void;
};

const useIsCallSetStore = create<CallSetStoreType>((set) => ({
  isCallSet: false,
  timeToCall: 0,
  callerId: '',
  setCallerId: (value: string) => set({ callerId: value }),
  setIsCallSet: (value: boolean) => set({ isCallSet: value }),
  setTimeToCall: (value: number) => set({ timeToCall: value }),
  decrementTimeToCall: () =>
    set((state) => ({ timeToCall: Math.max(0, state.timeToCall - 1) }))
}));

export default useIsCallSetStore;
