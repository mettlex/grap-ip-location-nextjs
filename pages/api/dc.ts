import type { NextApiRequest, NextApiResponse } from "next";

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const webhookUrl = process.env.DISCORD_IP_WEBHOOK_URL!;

  const data = JSON.stringify(req.body);

  console.log(data);

  try {
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        content: `\`\`\`json\n${data}\`\`\``,
      }),
      redirect: "follow",
    });
  } catch (error) {
    console.error(error);
  }

  res.status(200).json({});
}
