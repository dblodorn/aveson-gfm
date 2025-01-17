import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import { CampaignData, getAllCampaigns } from "../lib/getGFMCampaignData";

export const getServerSideProps = (async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  
  const campaigns: CampaignData[] = await getAllCampaigns();
  return { props: { campaigns } };
}) satisfies GetServerSideProps<{ campaigns: CampaignData[] }>;

export default function Home({
  campaigns,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <h1>Aveson Go Fund Me Campagins:</h1>
      <a className="underline" href="/api/all">Data</a>
      <ul className="grid grid-cols-4 gap-4">
        {campaigns.map((campaign) => (
          <li className="container p-2 border border-1 border-inherit" key={campaign.campaignName}>
            <img
              className="w-full aspect-square object-cover"
              src={campaign.photo}
              alt={campaign.title}
            />
            <div>
              <h2>{campaign.title}</h2>
              <p>
                {campaign.currentAmount} / {campaign.goalAmount}
              </p>
              <p>{campaign.percentage}%</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}