'use client';

import { get } from '@/ApisRequests/server';
import { Modal } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ITeamDetailsProps {
  id: string;
  token?: string | undefined | null;
  detailsModal: boolean;
  showDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ITeamData {
  _id: string;
  name: string;
  email: string;
  sport: string;
  team_logo: string;
  league: {
    _id: string;
    name: string;
    sport: string;
    league_image: string;
  };
  createdAt: string;
}

const TeamDetailsModal: React.FC<ITeamDetailsProps> = ({ id, token, detailsModal, showDetailsModal }) => {
  const [teamData, setTeamData] = useState<ITeamData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!id || !token) return toast.error('Please login to view team details');
      setLoading(true);
      try {
        const res = await get(`/team/get-single/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setTeamData(res.data);
      } catch (error) {
        console.error("Failed to fetch team data", error);
        toast.error('Failed to load team details');
      } finally {
        setLoading(false);
      }
    };

    if (detailsModal) {
      fetchTeam();
    }
  }, [id, token, detailsModal]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      open={detailsModal}
      title="Team Details"
      footer={null}
      onCancel={() => showDetailsModal(false)}
      width={800}
      centered
      className="max-w-[95vw]"
    >
      {loading ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
          <h2 className="text-zinc-900 dark:text-white mt-4 text-xl font-semibold">Loading Team Information</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Please wait while we fetch the team details</p>
        </div>
      ) : teamData ? (
        <div className="space-y-6">
          {/* Team Header - Responsive */}
          <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <div className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <img
                  src={teamData?.team_logo || '/default-team-logo.png'}
                  alt={`${teamData?.name} logo`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-gray-800"
                />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{teamData?.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                  {teamData?.league?.name || 'No league'}
                </p>
                <div className="mt-2 flex justify-center sm:justify-start">
                  <span className="px-2 py-1 text-xs sm:text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    {teamData?.sport}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Details - Responsive */}
          <div className="grid grid-cols-1 gap-2 sm:gap-2">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                League Information
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <div className="flex justify-center sm:justify-start">
                  <img
                    src={teamData?.league?.league_image || '/default-team-logo.png'}
                    alt={`${teamData?.name} logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 min-w-[64px] min-h-[64px] rounded-md border-4 border-white dark:border-gray-800"
                  />
                </div>
                <div className="w-full space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">League:</span>
                    <span className="text-sm sm:text-base font-medium dark:text-white">
                      {teamData?.league?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
                    <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Member Since:</span>
                    <span className="text-sm sm:text-base font-medium dark:text-white">
                      {formatDate(teamData?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-400">No team data available</p>
        </div>
      )}
    </Modal>
  );
};

export default memo(TeamDetailsModal);

