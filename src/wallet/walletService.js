const axios = require('axios');

async function pay(player, amount) {
    try {
        return await axios.post(
            process.env.SERVICE_WALLET_URL,
            {
                player: player,
                amount: amount
            }
        );
    } catch (err) {
        return err;
    }
}

exports.pay = pay;