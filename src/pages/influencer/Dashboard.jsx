import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";

export default function InfluencerDashboard() {
  const navigate = useNavigate();

  // dummy vendor posts
  const posts = [
    {
      id: 1,
      product: "Skincare Serum",
      description: "Looking for beauty influencers",
    },
    {
      id: 2,
      product: "Fitness Band",
      description: "Fitness & lifestyle creators needed",
    },
  ];

  return (
    <PageWrapper
      title="Available Campaigns"
      subtitle="Browse brand opportunities"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h3 className="font-semibold">{post.product}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {post.description}
            </p>

            <button
              onClick={() =>
                navigate(`/influencer/campaign/${post.id}`)
              }
              className="mt-4 text-blue-600 text-sm"
            >
              View Details →
            </button>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
