#!/usr/bin/env node
const path = require('path')
const skill = require('./index')

async function main(){
  const args = process.argv.slice(2)
  if(args[0]==='dry-run'){
    const payload = require(path.resolve(process.cwd(), 'examples', 'example-payload.json'))
    console.log('Dry run payload:', payload)
    const res = await skill.publish(payload, {dryRun:true})
    console.log('Result:', res)
    return
  }
  console.log('social-publish skill CLI. Use dry-run to test with examples/example-payload.json')
}

main().catch(err=>{console.error(err); process.exit(1)})
