import type { NextApiRequest, NextApiResponse } from "next";

import {
  getGFMCampaignData,
  CampaignDataWithFunding,
} from "../../lib/getGFMCampaignData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CampaignDataWithFunding>
) {
  const { name } = req.query;

  const campaignData = await getGFMCampaignData(name as string);

  if (campaignData) res.status(200).json(campaignData);
}
