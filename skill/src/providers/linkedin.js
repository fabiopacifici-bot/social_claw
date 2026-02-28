const fetch = require('node-fetch')

function validatePayload(payload){
  if(!payload) throw new Error('Payload required')
  if(!payload.body) throw new Error('body required')
}

async function registerUpload(accessToken, owner){
  // Register upload for UGC posts or images/videos. In production we'd POST to LinkedIn registerUpload endpoint.
  // Here, implement a helper that in production returns an uploadUrl and asset urn.
  // For now assume video/image uploads require multi-step; return placeholder structure.
  return {
    uploadUrl: 'https://uploads.linkedin.com/dryrun',
    asset: 'urn:li:digitalmediaAsset:dryrun-' + Date.now()
  }
}

async function uploadMedia(uploadUrl, media_path){
  // In production: PUT the media bytes to uploadUrl. Here: simulate success if file exists.
  const fs = require('fs')
  const exists = fs.existsSync(media_path)
  if(!exists) throw new Error('media file not found')
  return { uploaded: true, size: fs.statSync(media_path).size }
}

async function createShare(accessToken, owner, payload){
  // In production: POST to /ugcPosts or /posts. Here return simulated post URN/url.
  return {
    postUrn: 'urn:li:share:dryrun-' + Date.now(),
    url: `https://www.linkedin.com/feed/update/urn:li:share:dryrun-${Date.now()}`
  }
}

async function publish(payload, opts={}){
  validatePayload(payload)
  if(opts.dryRun){
    return {
      provider: 'linkedin',
      dryRun: true,
      postUrn: 'urn:li:share:dryrun-' + Date.now(),
      url: 'https://www.linkedin.com/feed/update/urn:li:share:dryrun-' + Date.now()
    }
  }
  const secrets = opts.secrets || {
    access_token: process.env.LINKEDIN_ACCESS_TOKEN,
    owner: process.env.LINKEDIN_OWNER_URN,
    personId: process.env.LINKEDIN_PERSON_ID
  }
  if(!secrets || !secrets.access_token) throw new Error('Missing LinkedIn access token (set LINKEDIN_ACCESS_TOKEN)')
  const owner = secrets.owner || `urn:li:person:${secrets.personId}`
  // If media provided, register and upload
  let asset = null
  if(payload.media_path){
    const reg = await registerUpload(secrets.access_token, owner)
    await uploadMedia(reg.uploadUrl, payload.media_path)
    asset = reg.asset
  }
  const res = await createShare(secrets.access_token, owner, payload)
  return {
    provider: 'linkedin',
    dryRun: false,
    postUrn: res.postUrn,
    url: res.url,
    asset: asset
  }
}

module.exports = { publish, validatePayload, registerUpload, uploadMedia, createShare }
