# Zomboid Mod Template
<p align="center">
  <img src="./contents/preview.png">
</p>

This is a simple template for Zomboid mods using [Pipewrench](https://github.com/asledgehammer/PipeWrench)!

## Available npm scripts
- `npm run zip` - Creates a zip file ready to be ported to `~/Zomboid/mods`
- `npm run steam` - Creates a zip file ready to be published in steam Workshop (put the generated contents in the zip on `~/Zomboid/Workhop`)
- `npm run tests` or `npm t` - Runs unit tests
- `npm run coverage` - Runs tests with coverage

## GitHub Actions
- When merging at `main`, the GitHub Action will automatically create a new version complete with a zip deploy