import type { NextApiRequest, NextApiResponse } from "next";

import { getGFMCampaignData, CampaignData } from "../../lib/getGFMCampaignData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CampaignData>,
) {
  const { name } = req.query;

  const campaignData = await getGFMCampaignData(name as string);

  res.status(200).json(campaignData);
}
