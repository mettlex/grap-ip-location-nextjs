import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const cors = Cors({
  methods: ["POST", "GET", "HEAD", "OPTIONS"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  await runMiddleware(req, res, cors);

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
