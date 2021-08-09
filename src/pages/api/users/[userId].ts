import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
  const { userId } = request.query;

  const users = [
    { id: userId, name: 'Pedro Javier' },
  ]

  return response.json(users)
}
