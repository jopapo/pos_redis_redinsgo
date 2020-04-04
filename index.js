#!/usr/bin/env node

const redis = require("redis");

// Conecta ao redis
const client = redis.createClient();

client.on('connect', function() {
    console.log('Redis client connected');
    startup()
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

function save_user(user_key, card_key) {
    client.hset(user_key, 'name', 'Usuário ' + i)
    client.hset(user_key, 'bcard', card_key)
    client.del(card_key)

    client.srandmember('bingo', 15, function(err, card_nums) {
        card_nums.forEach(function (val) {
            client.sadd(card_key, val)
        })
        console.log('User ' + user_key + ' - card: [' + card_nums + ']')
    })
}

function check_user_score(card_num, user_key) {
    client.hget(user_key, 'bcard', function(err, bcard) {
        client.smembers(bcard, function(err, card_nums) {
            if (card_nums.indexOf(card_num) >= 0) {
                //console.log(card_num + ' in ' + card_nums)
                client.zincrby('score', 1, user_key, function(err, points) {
                    console.log(user_key + ' now with ' + points + ' points')
                    if (points >= 15) {
                        client.hget(user_key, 'name', function(err, name) {
                            console.log(name + ' campeão!!!!  (' + user_key + ')')
                            process.exit()
                        })
                    } else {
                        next_score()
                    }
                })
            } else {
                next_score()
            }
        })
    })
}

function next_score() {
    client.spop('bingo', function(err, card_num) {
        if (card_num) {
            console.log('... ' + card_num)
            for (i = 1; i <= 50; i++) {
                key = 'user:' + i
                check_user_score(card_num, key)
            }
        }
    })
}

function startup() {
    console.log('Clearing state...')
    client.del('score')
    client.del('bingo')

    console.log('Creating bingo numbers...')
    for (i = 1; i <= 99; i++) {
        client.sadd('bingo', i)
    }

    console.log('Creating users and cards...')
    for (i = 1; i <= 50; i++) {
        key = 'user:' + i
        card_key = 'card:' + i
        save_user(key, card_key)
    }
    
    console.log('Starting game!')
    
    next_score()

    console.log('End of game!')
    
}
