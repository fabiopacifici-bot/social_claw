#!/usr/bin/env node
// Helper to show op CLI commands to create 1Password items for social-publish
// Usage: node create-1p-item-template.js <item-name> <vault>

const fs = require('fs')
const path = require('path')
const itemTemplate = {
  title: 'social-publish/<provider>',
  category: 'API Credentials',
  fields: [
    {type: 'STRING', label: 'client_id', value: ''},
    {type: 'STRING', label: 'client_secret', value: ''},
    {type: 'STRING', label: 'refresh_token', value: ''},
    {type: 'STRING', label: 'access_token', value: ''}
  ],
  notes: 'Fill these fields with real credentials. Do NOT commit secrets to Git.'
}

const name = process.argv[2] || 'social-publish/youtube'
const vault = process.argv[3] || 'Private'

console.log('# 1Password create item template')
console.log('# Edit values manually or pipe into `op item create --raw`')
console.log('item JSON file: ./secrets.template.json')

const out = Object.assign({}, itemTemplate, { title: name })
fs.writeFileSync(path.resolve(process.cwd(), 'secrets.template.json'), JSON.stringify(out, null, 2))

console.log('\nSample CLI to create item (interactive):')
console.log(`op item create --title "${name}" --category "API Credentials" --vault "${vault}" --generate-password=false`) 
console.log('\nOr create from template:')
console.log('op item create --raw < ./secrets.template.json')
