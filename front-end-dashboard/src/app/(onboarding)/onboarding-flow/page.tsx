"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { GoalSelection } from "../_components/goal-selection";
import { UserLevelSelection } from "../_components/user-level-selection";
import { GoalType, UserLevel } from "@/redux/feature/onBoarding/onBoardingType";
import { useState } from "react";
import { setOnboardingData } from "@/redux/feature/onBoarding/onBoardingSlice";
import { useRouter } from "next/navigation";


const OnboardingFlow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedGoal = useSelector(
    (state: RootState) => state.onboarding.onboardingData?.goal
  );
  const [currentStep, setCurrentStep] = useState<"goal" | "level">("goal");
  const router = useRouter();
  const handleGoalSelect = (goal: GoalType) => {
     const tempData = {
      goal,
      level: "beginner" as UserLevel,
    };

    dispatch(setOnboardingData(tempData));
       localStorage.setItem("fluentai-onboarding", JSON.stringify(tempData));
    setCurrentStep("level");
  };

  const handleLevelSelect = (level: UserLevel) => {
    if (selectedGoal) {
      // optionally update level in redux too
      const finalData = {
        goal: selectedGoal,
        level,
      };

      dispatch(setOnboardingData(finalData));
      localStorage.setItem("fluentai-onboarding", JSON.stringify(finalData));
      router.push("/dashboard");
    }
  };

  const handleBack = () => setCurrentStep("goal");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="w-full">
        {currentStep === "goal" && (
          <GoalSelection onGoalSelect={handleGoalSelect} />
        )}
        {currentStep === "level" && selectedGoal && (
          <UserLevelSelection
            onLevelSelect={handleLevelSelect}
            onBack={handleBack}
            selectedGoal={selectedGoal.title}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
