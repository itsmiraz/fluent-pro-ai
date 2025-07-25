import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TOnboardingData } from "./onBoardingType";

type OnboardingState = {
  onboardingData: TOnboardingData | null;
};

const initialState: OnboardingState = {
  onboardingData: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setOnboardingData: (state, action: PayloadAction<TOnboardingData>) => {
      state.onboardingData = action.payload;
    },
    resetOnboardingData: (state) => {
      state.onboardingData = null;
    },
  },
});

export const { setOnboardingData, resetOnboardingData } = onboardingSlice.actions;
export default onboardingSlice.reducer;
