const { WebClient } = require("@slack/web-api");

const token = process.env.SLACK_TOKEN;

const client = new WebClient(token);

const sendSlackMessage = async(message) => {
    try {
        const result = await client.chat.postMessage({
            channel: "UMG59FBFG",
            text: message
        });

        return result;
    } catch (e) {
        return e;
    }
}

module.exports = { sendSlackMessage };