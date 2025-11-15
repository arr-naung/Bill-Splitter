# Prompt for AI Coding Agent: Renaming Project "Tip Splitter" to "Bill Splitter"

# GOAL: Rename the entire project from "Tip Splitter" to "Bill Splitter," updating all necessary configurations and display names.

# CURRENT PROJECT STATUS:
# - React Native project using Expo.
# - The code is stable and functional.
# - The current app name is "Tip Splitter".
# - The current package identifiers are assumed to be based on "tipsplitter".

# NOTE TO AGENT: Apply changes directly to the provided code/files.

# --- TASK 1: UPDATE app.json CONFIGURATION ---
# IMPORTANT: These changes update the app's metadata and identifier.

# FILE: app.json

# REQUIRED CHANGES:
# 1. Change "name" from "Tip Splitter" to "Bill Splitter".
# 2. Change "slug" from "tip-splitter" to "bill-splitter".
# 3. Change "description" to a more general bill-splitting description (e.g., "Calculate tips, split bills among friends, and manage expenses easily.").
# 4. Change "ios.bundleIdentifier" from "com.arrnaung.tipsplitter" to "com.arrnaung.billsplitter".
# 5. Change "android.package" from "com.arrnaung.tipsplitter" to "com.arrnaung.billsplitter".

# --- TASK 2: UPDATE package.json ---

# FILE: package.json

# REQUIRED CHANGES:
# 1. Change the "name" field from "tip-splitter" to "bill-splitter".

# --- TASK 3: UPDATE CODE DISPLAY NAMES ---

# FILE: HomeScreen.js (which contains the main app title)

# REQUIRED CHANGES:
# 1. Locate the header title Text component.
# 2. Change the text content from "Tip Splitter" to "Bill Splitter".

# --- TASK 4: COMMAND LINE INSTRUCTIONS (Execute Externally) ---

# NOTE TO AGENT: Display these commands clearly so the human user can run them outside of the code execution.

# COMMANDS REQUIRED AFTER CODE CHANGES:
# 1. Stop the current Expo server: [Press Ctrl+C or equivalent]
# 2. Rename the project directory (run this command one level *above* the project folder):
#    mv tip-splitter bill-splitter
# 3. Navigate into the renamed directory:
#    cd bill-splitter
# 4. Clear the Expo cache and restart the server (CRUCIAL for name change to take effect):
#    npx expo start -c

# OUTPUT: Provide the full, modified content for app.json, package.json, and HomeScreen.js.