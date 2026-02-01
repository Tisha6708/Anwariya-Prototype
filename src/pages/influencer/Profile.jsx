import { useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";

export default function InfluencerProfile() {
  const [bio, setBio] = useState("");
  const [niche, setNiche] = useState("");

  return (
    <PageWrapper
      title="My Profile"
      subtitle="Let vendors know about you"
    >
      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <textarea
          placeholder="Short bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-3 w-full rounded mb-4"
        />

        <input
          placeholder="Niche (e.g. Fitness, Beauty)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="border p-3 w-full rounded mb-4"
        />

        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          Save Profile
        </button>
      </div>
    </PageWrapper>
  );
}
