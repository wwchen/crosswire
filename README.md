### Install
`npm install`

### Run
`npm start`

### Notes
See `git log`s

Several refactors to better support attributes of Astral Objects
- Created AstralObject class to encapsulate state data
- Moved (row, col) state from Map to AstralObject

map and map goal endpoints respond the map state differently, hacked a
way to ignore current map state

api respond randomly (guessing part of the exercise), just blindly
hitting api when a diff between current and goal state is recognized