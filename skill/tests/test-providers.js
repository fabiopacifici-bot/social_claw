const youtube = require('../skill/src/providers/youtube')
const linkedin = require('../skill/src/providers/linkedin')
const assert = require('assert')

async function run(){
  // youtube dry-run
  let res = await youtube.publish({title:'t', media_path:'./skill/examples/media-mock.png'}, {dryRun:true})
  assert(res.provider==='youtube')
  console.log('youtube dry-run OK', res.videoId)
  // linkedin dry-run
  res = await linkedin.publish({body:'hello'}, {dryRun:true})
  assert(res.provider==='linkedin')
  console.log('linkedin dry-run OK', res.postUrn)
}

run().catch(err=>{ console.error(err); process.exit(1)})
