Comprehensive React Native Application Generation Prompt

Project Overview: Tip Splitter Mobile App

Generate the complete code for a cross-platform mobile application named "Tip Splitter" using React Native. The application must adhere to a standard, scalable, and well-structured architecture, suitable for deployment via Expo or pure React Native CLI.

Architectural Requirements (Standard and Scalable Design)

Technology Constraint: Use standard React Native components (View, Text, TextInput, TouchableOpacity, Slider, etc.) and native styling using the StyleSheet.create method. DO NOT use any web-specific components (e.g., div, p, button) or web-based styling (Tailwind/CSS).

Structure: Use the following file structure. The AI agent MUST generate all seven files listed in the Deliverables section.

Component Principles: Use Functional Components and React Hooks exclusively. Implement Container/Presentational separation: Screen components (HomeScreen.js) manage state and logic, while utility components (PeopleCounter.js, etc.) focus only on rendering and prop handling. All components must be simple, focused, and reusable.

Core Feature Requirements

A. Core Logic and State

The main state (Bill, Tip %, People Count) must reside in HomeScreen.js. The core calculation logic must be encapsulated in a function in src/utils/Calculations.js. The app must update the results in real-time as the user changes the inputs.

B. Utility Logic (src/utils/Calculations.js)

Define a function calculateTip(bill, percentage, people) that returns an object containing { tipAmount, totalBill, perPerson }. Define a function formatCurrency(amount) that formats a number to a USD string (e.g., "$28.75").

C. UI Components

Bill Input (src/components/BillInput.js): Renders a TextInput with keyboardType="numeric". Must feature a clear '$' symbol prefix inside the input field's design.

Tip Slider (In HomeScreen.js): Uses the native Slider component (min=0, max=30, step=1). Clearly displays the current percentage value.

People Counter (src/components/PeopleCounter.js): Renders the split count and two TouchableOpacity buttons (- and +). Validation: The count must never go below 1.

Results Display (src/components/ResultsDisplay.js): Renders the three calculated results (tipAmount, totalBill, perPerson). The Per Person value must be visually prominent (largest font size, accent color).

D. Styling and Design

Define a clear, professional color palette in src/constants/Colors.js and import it wherever necessary. Use rounded corners, ample padding, and subtle shadows for a polished, modern, mobile look.

Final Deliverables (Files to be Generated)

The AI agent MUST output the complete, runnable code for all seven files listed below:
src/constants/Colors.js
src/utils/Calculations.js
src/components/BillInput.js
src/components/PeopleCounter.js
src/components/ResultsDisplay.js
src/screens/HomeScreen.js
App.js