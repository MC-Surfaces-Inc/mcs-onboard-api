const SlackMessages = {
  queuedClient: {
    blocks: (client) => {
      return [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Hello, you've got a new client ready to view!"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Times Submitted:*\t\t${client.timesSubmitted}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Date Submitted:*  \t\t${client.lastSubmittedAt}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Sales Rep.:*\t\t\t\t\t${client.firstName} ${client.lastName}`
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `Click the button to go to view ${client.name}'s information.`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "View "
            },
            "value": "click_me_123",
            "url": `https://employee.mcsurfacesinc.com/clients/${client.id}`,
            "action_id": "button-action"
          }
        }
      ]
    }
  }
}

module.exports = { SlackMessages };
