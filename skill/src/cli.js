#!/usr/bin/env node
const path = require('path')
const { spawnSync } = require('child_process')
const skill = require('./index')

function fetchSecretsFrom1Password(itemTitle, vault){
  try{
    const cmd = ['item','get',itemTitle,'--vault',vault,'--format','json']
    const res = spawnSync('op', cmd, { encoding: 'utf8' })
    if(res.status!==0) return null
    const obj = JSON.parse(res.stdout)
    const fields = {}
    for(const f of obj.fields||[]) fields[f.label] = f.value
    return fields
  }catch(e){
    return null
  }
}

async function main(){
  const args = process.argv.slice(2)
  if(args[0]==='dry-run'){
    const payload = require(path.resolve(process.cwd(), 'examples', 'example-payload.json'))
    console.log('Dry run payload:', payload)
    const res = await skill.publish(payload, {dryRun:true})
    console.log('Result:', res)
    return
  }
  if(args[0]==='publish'){
    const payload = require(path.resolve(process.cwd(), 'examples', 'example-payload.json'))
    // try to fetch secrets automatically from 1Password
    const youtubeFields = fetchSecretsFrom1Password('social-publish/youtube', 'Private')
    const linkedinFields = fetchSecretsFrom1Password('social-publish/linkedin', 'Private')
    const secrets = {}
    if(youtubeFields) secrets.youtube = youtubeFields
    if(linkedinFields) secrets.linkedin = linkedinFields
    console.log('Publishing with secrets:', !!secrets.youtube, !!secrets.linkedin)
    const res = await skill.publish(payload, {dryRun:false, secrets: { ... (secrets.youtube || {}), ...(secrets.linkedin || {}) }})
    console.log('Result:', res)
    return
  }
  console.log('social-publish skill CLI. Use dry-run or publish')
}

main().catch(err=>{console.error(err); process.exit(1)})
