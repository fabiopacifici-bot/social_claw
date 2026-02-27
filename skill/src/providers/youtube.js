const {google} = require('googleapis')

async function publish(payload, opts={}){
  // placeholder: expects oauth2 client to be created by caller with credentials from 1Password
  // payload: { title, body, media_path, visibility }
  // This function will be implemented to use youtube.videos.insert
  return { status: 'todo', provider: 'youtube' }
}

module.exports = { publish }
