export interface CustomGoal {
  id: string;
  title: string;
  description: string;
  custom: true;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
}

export type GoalType = LearningGoal | CustomGoal;

export type UserLevel = "beginner" | "intermediate" | "advanced"; // or however you define levels

export interface TOnboardingData {
  goal: GoalType;
  level: UserLevel;
}
