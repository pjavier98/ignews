import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    { id: 1, name: 'Pedro Javier' },
    { id: 2, name: 'Jose' },
    { id: 3, name: 'Gustavo' },
  ]

  return response.json(users)
}
