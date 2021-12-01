export default SlackMessages = {
  queuedClient: {
    "blocks": [
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
          "text": "*Times Submitted:*\t\t3 times"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Date Submitted:*  \t\t3am"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Sales Rep.:*\t\t\t\t\t3am"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Click the button to go to client page."
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View "
          },
          "value": "click_me_123",
          "url": "https://employee.mcsurfacesinc.com",
          "action_id": "button-action"
        }
      }
    ]
  }
}