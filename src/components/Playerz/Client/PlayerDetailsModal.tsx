'use client';

import { get } from '@/ApisRequests/server';
import { Modal } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface IPlayerDetailsProps {
  id: string;
  token?: string | undefined | null;
  detailsModal: boolean;
  showDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
}
interface IAddress {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
}
interface PlayerData {
  _id: string;
  name: string;
  position: string;
  email: string;
  experience: string;
  player_image: string;
  player_bg_image: string;
  totalTips: number;
  paidAmount: number;
  dueAmount: number;
  jerceyNumber: number;
  isStripeConnected: boolean;
  address?: IAddress;
  team: {
    _id: string;
    name: string;
    email: string;
    team_logo: string;
    team_bg_image: string;
  };
  league: {
    _id: string;
    name: string;
    league_image: string;
    sport: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PlayerDetailsModal: React.FC<IPlayerDetailsProps> = ({ id, token, detailsModal, showDetailsModal }) => {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id || !token) return toast.error('Please login to view player details');
      setLoading(true);
      try {
        const res = await get(`/player/get-single/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setPlayerData(res.data);
      } catch (error) {
        console.error("Failed to fetch player data", error);
      } finally {
        setLoading(false);
      }
    };

    if (detailsModal) {
      fetchPlayer();
    }
  }, [id, token, detailsModal]);

  return (
    <Modal
      open={detailsModal}
      title="Player Details"
      footer={null}
      onCancel={() => showDetailsModal(false)}
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div className="text-center">
            <div
              className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"
            ></div>
            <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your player being ready
            </p>
          </div>
        </div>
      ) : playerData ? (
        <div style={{ padding: '20px 0' }}>
          {/* Player Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <img
              src={playerData?.player_image || '/default-player.png'}
              alt={playerData?.name || 'N/A'}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '16px',
                border: '3px solid #f0f0f0'
              }}
            />
            <div>
              <h2 className='text-xl font-bold'>
                {playerData?.name || 'N/A'}
              </h2>
              <p className='text-sm text-gray-600'>
                {playerData?.position} • {playerData?.jerceyNumber || 'N/A'}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr  1fr', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  ${playerData?.totalTips || 0}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Total Tips</p>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  {playerData?.experience || 'N/A'}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Experience</p>
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>Team Information</h4>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <img
                src={playerData?.team?.team_logo}
                alt={playerData?.team?.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  objectFit: 'contain',
                  marginRight: '12px'
                }}
              />
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
                  {playerData?.team?.name}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                  Email : {playerData?.team?.email || 'No team email'}
                </p>
              </div>
            </div>
          </div>

          {/* League Info */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#333' }}>League Information</h4>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <img
                src={playerData?.league?.league_image}
                alt={playerData?.league?.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  marginRight: '12px'
                }}
              />
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
                  {playerData?.league?.name}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                  Sport : {playerData?.league?.sport}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>No player data available</p>
        </div>
      )}
    </Modal>
  );
};

export default memo(PlayerDetailsModal);