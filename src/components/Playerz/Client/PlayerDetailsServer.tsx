import PlayerDetailsModal from './PlayerDetailsModal';

interface IPlayerDetailsProps {
    token: string | undefined | null;
    id: string;
    detailsModal: boolean;
    showDetailsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlayerDetailsServer({
    token,
    id,
    detailsModal,
    showDetailsModal,
}: IPlayerDetailsProps) {
    return (
        <PlayerDetailsModal
            id={id}
            token={token}
            detailsModal={detailsModal}
            showDetailsModal={showDetailsModal}
        />
    );
}