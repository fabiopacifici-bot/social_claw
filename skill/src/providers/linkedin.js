function validatePayload(payload){
  if(!payload) throw new Error('Payload required')
  if(!payload.body) throw new Error('body required')
}

async function publish(payload, opts={}){
  validatePayload(payload)
  // dry-run: simulate creating a post and return a fake URN/URL
  return {
    provider: 'linkedin',
    dryRun: true,
    postUrn: 'urn:li:share:dryrun-' + Date.now(),
    url: 'https://www.linkedin.com/feed/update/urn:li:share:dryrun-' + Date.now()
  }
}

module.exports = { publish, validatePayload }
