const fs = require('fs')
const {google} = require('googleapis')

function validatePayload(payload){
  if(!payload) throw new Error('Payload required')
  if(!payload.title) throw new Error('title required')
  if(!payload.media_path) throw new Error('media_path required')
}

async function getOAuthClientFromSecrets(secrets){
  // secrets: {client_id, client_secret, refresh_token}
  const oAuth2Client = new google.auth.OAuth2(secrets.client_id, secrets.client_secret)
  if(secrets.refresh_token) oAuth2Client.setCredentials({refresh_token: secrets.refresh_token})
  return oAuth2Client
}

async function uploadVideo(oAuth2Client, media_path, metadata){
  const youtube = google.youtube({version:'v3', auth: oAuth2Client})
  const fileSize = fs.statSync(media_path).size
  const res = await youtube.videos.insert({
    part: ['snippet','status'],
    requestBody: {
      snippet: {
        title: metadata.title,
        description: metadata.description || '',
        tags: metadata.tags || []
      },
      status: {
        privacyStatus: metadata.privacy || 'unlisted'
      }
    },
    media: {
      body: fs.createReadStream(media_path)
    }
  }, {
    // Use onUploadProgress if needed
    // onUploadProgress: evt => console.log((evt.bytesRead/fileSize)*100 + '%')
  })
  return res.data
}

async function publish(payload, opts={}){
  validatePayload(payload)
  if(opts.dryRun){
    const exists = fs.existsSync(payload.media_path)
    const id = 'dryrun-' + Date.now()
    return {
      provider: 'youtube',
      dryRun: true,
      media_exists: exists,
      videoId: id,
      url: `https://youtu.be/${id}`
    }
  }
  // production path: secrets from opts or env vars
  const secrets = opts.secrets || {
    client_id: process.env.YOUTUBE_CLIENT_ID,
    client_secret: process.env.YOUTUBE_CLIENT_SECRET,
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
  }
  if(!secrets.client_id || !secrets.client_secret){
    throw new Error('Missing YouTube OAuth secrets (set YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN)')
  }
  const oauth2Client = await getOAuthClientFromSecrets(secrets)
  // ensure we have a valid access token (refresh if possible)
  try{
    await oauth2Client.getAccessToken()
  }catch(e){
    // attempt refresh by setting credentials
    if(secrets.refresh_token) oauth2Client.setCredentials({refresh_token: secrets.refresh_token})
  }
  // upload video
  const data = await uploadVideo(oauth2Client, payload.media_path, {
    title: payload.title,
    description: payload.description || '',
    tags: payload.tags || [],
    privacy: payload.privacy || 'unlisted'
  })
  return {
    provider: 'youtube',
    dryRun: false,
    videoId: data.id,
    url: `https://youtu.be/${data.id}`,
    raw: data
  }
}

module.exports = { publish, validatePayload, getOAuthClientFromSecrets, uploadVideo }
