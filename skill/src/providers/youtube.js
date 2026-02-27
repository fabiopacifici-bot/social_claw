const fs = require('fs')

function validatePayload(payload){
  if(!payload) throw new Error('Payload required')
  if(!payload.title) throw new Error('title required')
  if(!payload.media_path) throw new Error('media_path required')
}

async function publish(payload, opts={}){
  validatePayload(payload)
  // dry-run: validate file exists (if provided) and return simulated id/url
  if(opts.dryRun){
    const exists = fs.existsSync(payload.media_path)
    return {
      provider: 'youtube',
      dryRun: true,
      media_exists: exists,
      videoId: 'dryrun-' + Date.now(),
      url: 'https://youtu.be/dryrun-' + Date.now()
    }
  }
  // real implementation would go here (oauth + resumable upload)
  throw new Error('Real publish not implemented in this environment')
}

module.exports = { publish, validatePayload }
