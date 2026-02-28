require('dotenv').config()

const providers = {
  youtube: require('./providers/youtube'),
  linkedin: require('./providers/linkedin')
}

async function publish(payload, opts={}){
  // payload: { title, body, media_path, providers: ['youtube','linkedin'], visibility, schedule_time }
  const results = {}
  for(const p of payload.providers||[]){
    if(!providers[p]) throw new Error('Unknown provider: '+p)
    results[p] = await providers[p].publish(payload, opts)
  }
  return results
}

module.exports = { publish }
