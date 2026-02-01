export default function InfluencerProfileModal({
  influencerName,
  onClose,
}) {
  // dummy data for prototype
  const profile = {
    name: influencerName,
    bio: "Content creator focused on brand collaborations and audience engagement.",
    niche: ["Beauty", "Lifestyle"],
    contentTypes: ["Reels", "Stories"],
    experience: "Intermediate",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* BIO */}
        <p className="text-gray-600 mb-4">
          {profile.bio}
        </p>

        {/* NICHE */}
        <div className="mb-3">
          <p className="font-medium">Niche</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {profile.niche.map((n, i) => (
              <span
                key={i}
                className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* CONTENT TYPE */}
        <div className="mb-3">
          <p className="font-medium">Content Type</p>
          <p className="text-sm text-gray-500">
            {profile.contentTypes.join(", ")}
          </p>
        </div>

        {/* EXPERIENCE */}
        <div className="mb-5">
          <p className="font-medium">Experience Level</p>
          <p className="text-sm text-gray-500">
            {profile.experience}
          </p>
        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
