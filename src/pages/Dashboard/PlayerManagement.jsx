import {
  ArrowLeftOutlined,
  CameraOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Spin,
  Table,
  Upload,
  message,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import toast from "react-hot-toast";
import { BsFiletypeCsv } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useGetAllLeagueQuery } from "../../Redux/Apis/leagueApis";
import {
  useCreatePlayerMutation,
  useDeletePlayerMutation,
  useDeletePlayerSelectedMutation,
  useGetAllPlayerQuery,
  useInvitePlayerMutation,
  useSendPlayerTipMutation,
  useUpdatePlayerMutation,
} from "../../Redux/Apis/playerApis";
import { useGetAllTeamQuery } from "../../Redux/Apis/teamApis";
import { imageUrl } from "../../Utils/BaseUrl";

const PlayerManagement = () => {
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [deleteSelect, { isLoading: deletingSelect }] =
    useDeletePlayerSelectedMutation();
  const [isTipsDetailsModalVisible, setIsTipsDetailsModalVisible] =
    useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [form] = Form.useForm();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(250);
  const [profileImage, setProfileImage] = useState(null);
  const [BgImage, setBgImage] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [league, setLeague] = useState("");

  const userNameRef = useRef();
  const passwordRef = useRef();
  const [invitedData, setInvitedData] = useState(null);

  const [tipAmount, setTipAmount] = useState(0);

  useEffect(() => {
    if (invitedData) {
      form.setFieldsValue({
        username: invitedData?.userName,
        password: invitedData?.invitedPassword,
      });
    } else {
      form.resetFields();
    }
  }, [invitedData, form]);
  const [signIn, setSignIn] = useState(null);
  const [sort, setSort] = useState(null);
  const {
    data: players,
    isFetching,
    isLoading,
  } = useGetAllPlayerQuery({
    searchTerm,
    page,
    limit,
    sort,
    ...(signIn === null && signIn === undefined ? { signIn } : {}),
  });
  const { data: leagueData, isLoading: leagueLading } = useGetAllLeagueQuery({
    limit: 9999999,
  });
  const {
    data: teams,
    isLoading: teamLoading,
    isFetching: teamFetching,
  } = useGetAllTeamQuery({ limit: 9999999, league });
  const [createPlayer, { isLoading: creating }] = useCreatePlayerMutation();
  const [updatePlayer, { isLoading: updating }] = useUpdatePlayerMutation();
  const [deletePlayer, { isLoading: deleting }] = useDeletePlayerMutation();
  const [invitePlayer, { isLoading: inviting }] = useInvitePlayerMutation();
  const [sendTip, { isLoading: tipping }] = useSendPlayerTipMutation();
  const [selectItemId, setSelectItemId] = useState([]);
  const { user } = useUserProfile();

  const [csvReady, setCsvReady] = useState(false);

  const { data: csvPlayer, isLoading: csvDataLoading } = useGetAllPlayerQuery(
    { limit: 999999999999999 },
    { skip: !csvReady }
  );

  const exportDataCsv = () => {
    if (!csvPlayer?.data?.result) return [];
    return csvPlayer?.data.result.map((player) => ({
      _id: player?._id || "N/A",
      name: player?.name || "N/A",
      league_id: player?.league?._id || "N/A",
      league_name: player?.league?.name || "N/A",
      sport: player?.league?.sport || "N/A",
      team_id: player?.team?._id || "N/A",
      team_name: player?.team?.name || "N/A",
      position: player?.position || "N/A",
      player_image: player?.player_image || "N/A",
      player_bg_image: player?.player_bg_image || "N/A",
      totalTips: player?.totalTips || 0,
      paidAmount: player?.paidAmount || 0,
      dueAmount: player?.dueAmount || 0,
      isStripeConnected: player?.isStripeConnected || false,
      createdAt: player?.createdAt || "N/A",
      updatedAt: player?.updatedAt || "N/A",
      __v: player?.__v || 0,
      isBookmark: player?.isBookmark || false,
    }));
  };

  const columns = [
    { title: "Player Name", dataIndex: "name", key: "name" },
    {
      title: "League",
      dataIndex: "league",
      key: "league",
      render: (league) => `${league?.name}`,
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
      render: (team) => `${team?.name}`,
    },
    { title: "Position", dataIndex: "position", key: "position" },
    {
      title: "Profile Image",
      dataIndex: "player_image",
      key: "player_image",
      render: (player_image) => (
        <img src={`${imageUrl(player_image)}`} alt="bg" className="w-14 h-10" />
      ),
    },
    {
      title: "Background Image",
      dataIndex: "player_bg_image",
      key: "player_bg_image",
      render: (player_bg_image) => (
        <img
          src={`${imageUrl(player_bg_image)}`}
          alt="bg"
          className="w-14 h-10"
        />
      ),
    },
    ...(user?.user?.role === "superAdmin"
      ? [
        {
          title: "Tips Details",
          key: "tipsDetails",
          render: (_, record) => (
            <button
              onClick={() => handleTipsDetails(record)}
              className="bg-yellow-500 text-white text-xl p-2 py-1 rounded-md"
            >
              <EyeOutlined />
            </button>
          ),
        }] : []),
    ...(user?.user?.role === "superAdmin"
      ? [
        {
          title: "Invite",
          key: "invite",
          render: (_, record) => (
            <button
              onClick={() => handleInvite(record)}
              className={`${record?.invitedPassword || record?.userName
                ? "bg-red-500"
                : "bg-blue-500"
                } text-white text-xl p-2 py-1 rounded-md`}
            >
              <MailOutlined />
            </button>
          ),
        },
      ]
      : []),
    ...(user?.user?.role === "superAdmin"
      ? [
        {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(record)}
                className="bg-green-500 text-white text-xl p-2 py-1 rounded-md"
              >
                <EditOutlined />
              </button>
              <button
                onClick={() => handleDelete(record?._id)}
                className="bg-red-500 border-none text-white text-xl p-2 py-1 rounded-md"
              >
                <DeleteOutlined />
              </button>
              {/* <button
            onClick={() => handleDelete(record._id)}
            className="bg-red-500 text-white text-xl p-2 py-1 rounded-md"
          >
            <DeleteOutlined />
          </button> */}
            </div>
          ),
        },
      ]
      : []),
  ];

  const handleAdd = () => {
    setSelectedPlayer(null);
    setProfileImage(null);
    form.resetFields();
    setBgImage(null);
    setIsAddEditModalVisible(true);
  };

  const handleEdit = (player) => {
    setSelectedPlayer(player);
    setIsAddEditModalVisible(true);
    form.setFieldsValue({
      name: player?.name,
      league: player?.league?._id,
      team: player?.team?._id,
      position: player?.position,
    });
    setBgImage(`${imageUrl(player?.player_bg_image)}`);
    setProfileImage(`${imageUrl(player?.player_image)}`);
  };

  const handleTipsDetails = (player) => {
    setSelectedPlayer(player);
    setIsTipsDetailsModalVisible(true);
  };

  const handleInvite = (player) => {
    setSelectedPlayer(player?._id);
    const data = {
      userName: player.username || "",
      invitedPassword: player.invitedPassword || "",
    };
    setInvitedData(data);
    setIsInviteModalVisible(true);
  };
  const handleDeleteManyPlayer = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this team?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const deleteData = {
        ids: selectItemId,
      };

      try {
        await deleteSelect(deleteData).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        message.success("Player deleted successfully");
        setSelectItemId([]);
        setSelectedRowKeys([]);
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: `Failed to delete player.`,
          icon: "error",
        });
        message.error("Failed to delete player", error);
      }
    } else {
      message.info("Delete operation canceled");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deletePlayer(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        message.success("Player deleted successfully");
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete player.",
          icon: "error",
        });
        message.error("Failed to delete player");
      }
    } else {
      message.info("Delete operation canceled");
    }
  };

  const handleFinish = async (values) => {
    const data = {
      league: values?.league,
      name: values?.name,
      position: values?.position,
      team: values?.team,
    };
    if (values?.playerImage?.file) {
      data.player_image = values?.playerImage?.file;
    }
    if (values?.backgroundImage?.file) {
      data.player_bg_image = values?.backgroundImage?.file;
    }
    const formData = new FormData();
    Object.keys(data)?.map((key) => {
      formData.append(key, data[key]);
    });
    if (selectedPlayer?._id) {
      updatePlayer({ id: selectedPlayer?._id, data: formData })
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
          form.resetFields();
          setBgImage(null);
          setProfileImage(null);
          setIsAddEditModalVisible(false);
        })
        .catch((err) => {
          toast.error(err?.data?.message);
        });
    } else {
      createPlayer(formData)
        .unwrap()
        .then((res) => {
          toast.success(res?.message);
          form.resetFields();
          setBgImage(null);
          setProfileImage(null);
          setSelectedPlayer(null);
          setIsAddEditModalVisible(false);
        })
        .catch((err) => {
          toast.error(err?.data?.message);
        });
    }
  };

  const handleSendTip = async () => {
    sendTip({ id: selectedPlayer._id, data: { amount: Number(tipAmount) } })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
        form.resetFields();
        setIsInviteModalVisible(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  const handleInviteSubmit = async (value) => {
    invitePlayer({ id: selectedPlayer, data: value })
      .unwrap()
      .then((res) => {
        toast.success(res?.message);
        form.resetFields();
        setIsInviteModalVisible(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message);
      });
  };

  const handleCopy = (type) => {
    if (type === "password" && passwordRef.current) {
      passwordRef.current.select();
      document.execCommand("copy");
      toast.success("Password copied successfully!");
    } else if (type === "username" && userNameRef.current) {
      userNameRef.current.select();
      document.execCommand("copy");
      toast.success("Username copied successfully!");
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      const selectedIds = selectedRows.map((row) => row._id);
      setSelectItemId(selectedIds);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div className="p-4 h-[80vh] overflow-y-scroll bg-[var(--bg-gray-20)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Link to={-1}>
            <ArrowLeftOutlined
              style={{
                color: "#52c41a",
                fontSize: "18px",
                cursor: "pointer",
                marginRight: "8px",
              }}
            />
          </Link>
          <h4 className="text-lg font-semibold">Player Management</h4>
          <Button
            disabled={csvDataLoading}
            className="ml-4 bg-[#2FC191] text-white"
            onClick={() => setCsvReady(true)}
          >
            {csvDataLoading ? "Processing your Data..." : "Download CSV"}
          </Button>
          <div>
            {csvPlayer?.data && (
              <CSVLink
                data={exportDataCsv()}
                headers={[
                  { label: "ID", key: "_id" },
                  { label: "Name", key: "name" },
                  { label: "League ID", key: "league_id" },
                  { label: "League Name", key: "league_name" },
                  { label: "Sport", key: "sport" },
                  { label: "Team ID", key: "team_id" },
                  { label: "Team Name", key: "team_name" },
                  { label: "Position", key: "position" },
                  { label: "Player Image", key: "player_image" },
                  { label: "Player BG Image", key: "player_bg_image" },
                  { label: "Total Tips", key: "totalTips" },
                  { label: "Paid Amount", key: "paidAmount" },
                  { label: "Due Amount", key: "dueAmount" },
                  { label: "Is Stripe Connected", key: "isStripeConnected" },
                  { label: "Created At", key: "createdAt" },
                  { label: "Updated At", key: "updatedAt" },
                  { label: "Version", key: "__v" },
                  { label: "Bookmark", key: "isBookmark" },
                ]}
                filename={`user-management-${new Date().toISOString()}.csv`}
                className="flex items-center ml-2 justify-center gap-2"
              // onClick={() => setCsvReady(true)} // Set csvReady to true only when clicked
              >
                <Button
                  style={{
                    backgroundColor: "#053697",
                    color: "white",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#053692")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#053697")
                  }
                >
                  <BsFiletypeCsv />
                  Export to CSV
                </Button>
              </CSVLink>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            placeholder="All"
            defaultValue="false"
            style={{ width: 120 }}
            onChange={(value) => setSignIn(value)}
          >
            <Select.Option value="false">All</Select.Option>
            <Select.Option value="true">Sign In</Select.Option>
          </Select>
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search here..."
            prefix={<FaSearch />}
            className="w-64"
          />
        </div>
      </div>
      <div className="flex items-center justify-end w-full">
        {user?.user?.role === "superAdmin" && (
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={selectItemId?.length === 0}
              icon={
                deletingSelect ? "" : <PlusOutlined className="rotate-45" />
              }
              onClick={handleDeleteManyPlayer}
              className={`bg-red-500 mb-3 ${selectItemId?.length === 0 ? "cursor-not-allowed" : ""
                }`}
            >
              {deletingSelect ? <Spin size="small" /> : "Delete Selected"}
            </Button>
            <div className="flex items-center gap-2">
              <Select
                style={{ width: 200 }}
                onChange={(value) => setSort(value)}
                value={sort}
                placeholder="Sort by"
              >
                <Select.Option value="position">Position</Select.Option>
                <Select.Option value="sport">Sport</Select.Option>
                <Select.Option value="name">A to Z</Select.Option>
                <Select.Option value="-name">Z to A</Select.Option>
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                className="bg-green-500"
              >
                Add
              </Button>
            </div>

          </div>
        )}
      </div>

      <Table
        scroll={{ x: "max-content" }}
        dataSource={players?.data?.result || []}
        columns={columns}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        rowKey="_id"
        pagination={{
          position: ["bottomCenter"],
          pageSize: players?.data?.meta?.limit,
          total: players?.data?.meta?.total,
          onChange: (page) => setPage(page),
          showSizeChanger: false,
        }}
        loading={
          isLoading ||
          creating ||
          updating ||
          deleting ||
          inviting ||
          tipping ||
          isFetching ||
          leagueLading
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        open={isAddEditModalVisible}
        onCancel={() => setIsAddEditModalVisible(false)}
        footer={null}
        centered
      >
        <h2 className="text-center font-semibold text-lg mb-6">
          {selectedPlayer ? "Edit Player" : "Add Player"}
        </h2>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="name"
            label="Player Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter player name" />
          </Form.Item>
          <Form.Item name="league" label="League" rules={[{ required: true }]}>
            <Select
              onChange={(league) => setLeague(league)}
              showSearch
              placeholder="Select league"
            >
              {leagueData?.data?.result?.map((item) => (
                <Select.Option key={item?._id} value={item?._id}>
                  {item?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="team" label="Team" rules={[{ required: true }]}>
            <Select showSearch placeholder="Select team">
              {teamLoading || teamFetching ? (
                <Select.Option value="">please wait loading....</Select.Option>
              ) : (
                teams?.data?.result?.map((item) => (
                  <Select.Option key={item?._id} value={item?._id}>
                    {item?.name}
                  </Select.Option>
                ))
              )}
            </Select>
          </Form.Item>
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter position" />
          </Form.Item>
          <Form.Item label="Player Image" name="playerImage">
            <Upload
              onChange={(info) =>
                setProfileImage(URL.createObjectURL(info.file))
              }
              listType="picture-card"
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => false}
            >
              {profileImage ? (
                <div className="relative">
                  <Image
                    width={100}
                    src={profileImage}
                    alt="Preview"
                    preview={false}
                  />
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() => setProfileImage(null)} // Clear the preview when clicked
                    className="absolute top-0 right-0 text-red-500"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <CameraOutlined className="text-green-500 mb-2" />
                  <span className="text-green-500">Profile</span>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Background Image" name="backgroundImage">
            <Upload
              onChange={(info) => setBgImage(URL.createObjectURL(info.file))}
              listType="picture-card"
              maxCount={1}
              showUploadList={false}
              beforeUpload={() => false}
            >
              {BgImage ? (
                <div className="relative">
                  <Image
                    width={100}
                    src={BgImage}
                    alt="Preview"
                    preview={false}
                  />
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() => setBgImage(null)} // Clear the preview when clicked
                    className="absolute top-0 right-0 text-red-500"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <CameraOutlined className="text-green-500 mb-2" />
                  <span className="text-green-500">Background</span>
                </div>
              )}
            </Upload>
          </Form.Item>
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setIsAddEditModalVisible(false)}
              className="text-green-500 border-green-500"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-green-500">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Tips Details Modal */}
      <Modal
        open={isTipsDetailsModalVisible}
        onCancel={() => setIsTipsDetailsModalVisible(false)}
        footer={null}
        centered
      >
        <h2 className="text-center font-semibold text-lg mb-6">Tips Details</h2>
        <div className="space-y-4">
          <p>
            Total Tips:{" "}
            <span className="float-right">
              $ {selectedPlayer?.totalTips?.toFixed(2)}
            </span>
          </p>
          <p>
            Paid Amount:{" "}
            <span className="float-right">
              {" "}
              $ {selectedPlayer?.paidAmount?.toFixed(2)}
            </span>
          </p>
          <p>
            Due:{" "}
            <span className="float-right">
              {" "}
              $ {selectedPlayer?.dueAmount?.toFixed(2)}
            </span>
          </p>
          <p>Send Money ($):</p>
          <Input
            value={tipAmount}
            onChange={(e) => setTipAmount(e?.target?.value)}
            type="number"
            placeholder="Enter Amount"
          />
          <Button
            type="primary"
            className="w-full mt-4 bg-green-500"
            onClick={handleSendTip}
          >
            Confirm
          </Button>
        </div>
      </Modal>

      {/* Invite Modal */}
      <Modal
        open={isInviteModalVisible}
        onCancel={() => {
          setIsInviteModalVisible(false);
          setInvitedData(null); // Clear invited data
          form.resetFields(); // Clear form fields
        }}
        footer={null}
        centered
      >
        <h2 className="text-center font-semibold text-lg mb-6">
          Invite Credential
        </h2>
        <Form
          form={form}
          onFinish={handleInviteSubmit}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="username"
            label="User Name"
            rules={[
              {
                message: "Username is required",
                required: true,
              },
            ]}
          >
            <Input
              // ref={(input) => input && input.select()}
              ref={userNameRef}
              addonAfter={
                <button onClick={() => handleCopy("username")} type="button">
                  <CopyOutlined />
                </button>
              }
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                message: "Password is required",
                required: true,
              },
            ]}
          >
            <Input
              // ref={(input) => input && input.select()}
              ref={passwordRef}
              addonAfter={
                <button onClick={() => handleCopy("password")} type="button">
                  <CopyOutlined />
                </button>
              }
            />
          </Form.Item>
          <Button
            disabled={!!invitedData?.userName || !!invitedData?.invitedPassword}
            htmlType="submit"
          >
            {invitedData?.userName || invitedData?.invitedPassword
              ? "Already invited"
              : "Invite"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default PlayerManagement;
