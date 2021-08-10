import {NextApiRequest, NextApiResponse} from "next";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  console.log('evento recebido')

  response.status(200).json({ ok: true })
}
