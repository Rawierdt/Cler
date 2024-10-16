// shard.js
const { ShardingManager } = require('discord.js');
require('dotenv').config();
const TOKEN = process.env.BOT_TOKEN;

// Crea el ShardingManager para gestionar los shards
const manager = new ShardingManager('./index.js', { // Aquí apunta a tu archivo principal
    token: TOKEN,
    totalShards: 'auto' // Deja que Discord decida cuántos shards usar
});

// Evento que avisa cada vez que un shard es lanzado
manager.on('shardCreate', shard => {
    console.log(`[Shard] Lanzado shard ${shard.id}`);
});

// Inicia los shards
manager.spawn().catch(err => console.error('[Shard Error]', err));
