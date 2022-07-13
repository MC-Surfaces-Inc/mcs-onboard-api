const { WebClient } = require("@slack/web-api");

const token = process.env.SLACK_TOKEN;

const client = new WebClient(token);

const publishMessage = async (id, message) => {
    try {
        const result = await client.chat.postMessage({
           token: token,
           channel: id,
           blocks: message,
        });

        return result;
    } catch (e) {
        return e;
    }
}

const findConversation = async (name) => {
    try {
        const result = await client.conversations.list({
            token: token,
            types: "private_channel",
        });

        for (const channel of result.channels) {
            if (channel.name === name) {
                return channel;
            }
        }

        return result;
    } catch (e) {
        return e;
    }
}

module.exports = { findConversation, publishMessage };
