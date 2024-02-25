try { require('node-canvas-webgl') } catch (e) { throw Error('node-canvas-webgl is not installed, you can install it with `npm install PrismarineJS/node-canvas-webgl`') }

const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').headless
const pathfinder = require('mineflayer-pathfinder').pathfinder
const collectBlock = require('mineflayer-collectblock').plugin


const bot = mineflayer.createBot({
  host: 'nothacker7.aternos.me', 
  port: 39196,
  username: 'bot'
})

// Load pathfinder and collect block plugins
bot.loadPlugin(pathfinder)
bot.loadPlugin(collectBlock)

// Reverse string function
function reverseString(str) {
  return str.split('').reverse().join('');
}



bot.once('spawn', () => {
  console.log('Bot spawned!')
})

bot.once('spawn', () => {
  // Record 200 frames, 512x512 pixels, and save them to output.mp4
  mineflayerViewer(bot, { output: 'output.mp4', frames: 200, width: 512, height: 512 })
  bot.setControlState('jump', true)
})

// Listen for when a player says "collect [something]" in chat
bot.on('chat', (username, message) => {
  const args = message.split(' ')
  if (args[0] !== 'collect') return

  let blockType = null;
  const blockTypeName = args[1];

  for (const name in bot.registry.blocksByName) {
    if (name === blockTypeName) {
      blockType = bot.registry.blocksByName[name];
      break;
    }
  }

  if (!blockType) {
    bot.chat("I don't know any blocks with that name.");
    return;
  }

  bot.chat('Collecting the nearest ' + blockType.name)

  // Try and find that block type in the world
  const block = bot.findBlock({
    matching: blockType.id,
    maxDistance: 64
  })

  if (!block) {
    bot.chat("I don't see that block nearby.")
    return
  }

  // Collect the block if we found one
  bot.collectBlock.collect(block, err => {
    if (err) bot.chat(err.message)
  })
})
