import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Link from "next/link";
import { CampaignDataWithFunding, getAllCampaigns } from "../lib/getGFMCampaignData";

export const getServerSideProps = (async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=300"
  );

  const campaigns: CampaignDataWithFunding[] = await getAllCampaigns();
  return { props: { campaigns } };
}) satisfies GetServerSideProps<{ campaigns: CampaignDataWithFunding[] }>;

export default function Home({
  campaigns,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <h1>Aveson Go Fund Me Campagins:</h1>
      <Link className="underline" href="/api/all">
        Data
      </Link>
      <ul className="grid grid-cols-4 gap-4">
        {campaigns.map((campaign) => (
          <li
            className="container p-2 border border-1 border-inherit"
            key={campaign.title}
          >
            <img
              className="w-full aspect-square object-cover"
              src={campaign.photo}
              alt={campaign.title}
            />
            <div>
              <h2>{campaign.title}</h2>
              <p>
                {campaign.fundingData.currentAmount.formatted} /{" "}
                {campaign.fundingData.goalAmount.formatted}
              </p>
              <p>{campaign.fundingData.percentage}%</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}