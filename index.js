#!/usr/bin/env node

const redis = require("redis");

// Conecta ao redis
const client = redis.createClient();

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

console.log('Check bingo numbers existence...')
client.scard('bingo', function(err, result) {
    if (result <= 0) {
        console.log('Creating bingo numbers...')
        for (i = 1; i <= 99; i++) {
            client.sadd('bingo', i)
        }
    }
})

function save_user(user_key, card_key, score_key) {
    client.hset(user_key, 'name', 'Usuário ' + i)
    client.hset(user_key, 'bcard', card_key)
    client.hset(user_key, 'bscore', score_key)

    client.srandmember('bingo', 15, function(err, card_nums) {
        for (card_num in card_nums) {
            client.sadd(card_key, card_num)
        }
        console.log('User ' + user_key + ' - card: [' + card_nums + ']')
    })
}

console.log('Creating users and cards...')
for (i = 1; i <= 50; i++) {
    key = 'user:' + i
    card_key = 'card:' + i
    score_key = 'score:' + i
    save_user(key, card_key, score_key)
}

console.log('Starting game!')

client.srandmember('bingo', function(err, card_num) {
    
})

console.log('End of game!')

//client.end(true)

//process.exit();
