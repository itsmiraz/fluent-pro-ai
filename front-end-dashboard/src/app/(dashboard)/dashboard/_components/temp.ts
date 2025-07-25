
// Generate scenario based on learning goal
// const generateScenario = (onboardingData?: TOnboardingData): Scenario => {
//   if (!onboardingData) {
//     return {
//       id: "general",
//       title: "Casual Conversation",
//       description: "Practice everyday conversation skills",
//       context:
//         "You're having a friendly chat with someone you just met at a coffee shop.",
//     };
//   }

//   const { goal, level } = onboardingData;

//   switch (goal.id) {
//     case "daily-conversation":
//       return {
//         id: "daily-chat",
//         title: "Neighborhood Chat",
//         description: "Practice casual conversation with a neighbor",
//         context:
//           "You've just moved to a new neighborhood and are chatting with your neighbor about the area.",
//       };
//     case "professional-corporate":
//       return {
//         id: "meeting-delay",
//         title: "Explaining a Project Delay",
//         description: "Communicate a delay to your manager professionally",
//         context:
//           "You need to inform your boss about a project delay and propose solutions.",
//       };
//     case "sales-client-meetings":
//       return {
//         id: "product-demo",
//         title: "Product Demonstration",
//         description: "Present your product to a potential client",
//         context:
//           "You're demonstrating your company's new software to an interested client.",
//       };
//     case "ielts-academic":
//       return {
//         id: "ielts-part2",
//         title: "IELTS Speaking Part 2",
//         description: "Describe a memorable experience",
//         context:
//           "Describe a time when you learned something new. You have 2 minutes to speak.",
//       };
//     case "public-speaking":
//       return {
//         id: "presentation-intro",
//         title: "Presentation Opening",
//         description: "Practice opening a presentation confidently",
//         context:
//           "You're opening a presentation about climate change to a group of colleagues.",
//       };
//     case "writing-email":
//       return {
//         id: "email-discussion",
//         title: "Discussing Email Content",
//         description: "Verbally discuss professional email topics",
//         context:
//           "You're discussing the content of an important email with a colleague before sending it.",
//       };
//     default:
//       return {
//         id: "custom",
//         title: "Custom Practice",
//         description: `Practice ${goal.title.toLowerCase()}`,
//         context: `Let's practice scenarios related to ${goal.title.toLowerCase()}.`,
//       };
//   }
// };

// // Initialize scenario when modal opens
// useEffect(() => {
//   if (isOpen && !currentScenario) {
//     const scenario = generateScenario(onboardingData);
//     setCurrentScenario(scenario);

//     // Add initial AI message
//     setConversationHistory([
//       {
//         type: "ai",
//         content: `${scenario.context} I'll be your conversation partner. When you're ready, click the microphone to start speaking!`,
//         timestamp: new Date(),
//       },
//     ]);
//   }
// }, [isOpen, onboardingData]);



//   const handleSwitchScenario = () => {
//     setIsScenarioSelectorOpen(true);
//   };

//   const handleScenarioSelect = (scenario: Scenario) => {
//     setCurrentScenario(scenario);
//     setConversationHistory([
//       {
//         type: "ai",
//         content: `${scenario.context} I'll be your conversation partner. When you're ready, click the microphone to start speaking!`,
//         timestamp: new Date(),
//       },
//     ]);
//     setIsScenarioSelectorOpen(false);
//     setTranscription("");
//     setAiResponse("");
//   };
