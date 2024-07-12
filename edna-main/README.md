# Edna

[Edna](https://edna.arslexis.io) is a note taking app for developers and power users.

To learn more, see https://edna.arslexis.io/help

## Compiling and running for yourself

* `go run ./server/ -build-frontend`
* `go build -o edna ./server/` (on Windows, `-o edna.exe`)

This generates a stand-along `edna` binary that can run on Windows desktop, Mac desktop or Linux server.

To run: `./edna -run-prod`

Edna runs on port `9325` so visit http://localhost:9325'

## Credits

Edna started as a fork of Heynote but I've added many features since:
* ability to have multiple notes, so that it can be used as a note taking app in addition to being a scratchpad
* made it a web app, with ability to store notes on disk
* note switcher inspired by Notational Velocity (`Ctrl + P` / `⌘ + P)
* command palette
* context menu
* ability to run JavaScript functions, either to produce output or transform the content of block or selection
* ability to execute Go code blocks
