import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Link from "next/link";
import { CampaignDataWithFunding, getAllCampaigns } from "../lib/getGFMCampaignData";

export const maxDuration = 25;

export const getServerSideProps = (async ({ res }) => {  
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=240, stale-while-revalidate=1200"
  );

  const campaigns: CampaignDataWithFunding[] = await getAllCampaigns();
  return { props: { campaigns } };
}) satisfies GetServerSideProps<{ campaigns: CampaignDataWithFunding[] }>;

export default function Home({
  campaigns,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid grid-cols-1 gap-2 p-4">
      <h1>Aveson Community Go Fund Me Campagins:</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {campaigns.map((campaign) => (
          <li
            className="container p-3 border border-1 border-inherit"
            key={campaign.title}
          >
            <img
              className="w-full aspect-square object-cover"
              src={campaign.photo}
              alt={campaign.title}
            />
            <div className="flex flex-row justify-between pt-3">
              <div>
                <h2>{campaign.title}</h2>
                <p>
                  {campaign.fundingData.currentAmount.formatted} /{" "}
                  {campaign.fundingData.goalAmount.formatted}
                </p>
                <p>{campaign.fundingData.percentage}%</p>
              </div>
              <div className="flex flex-col">
                <Link
                  href={campaign.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Support
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}