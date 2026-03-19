'use client';

import React, { useCallback, useState } from 'react';
import {
  Button,
  Input,
  Checkbox,
  Typography,
  Form,
  Spin,
  Select,
} from 'antd';
import { FaGoogle } from 'react-icons/fa6';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Image from 'next/image';
import Link from 'next/link';
import logo_green from '@/Assets/logo_green.png';
import phoneImage from '@/Assets/phone_image.png';
import { signUpHandler } from '@/ApisRequests/Auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
const { Title, Text } = Typography;
import Cookies from 'js-cookie';
import { post } from '@/ApisRequests/server';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import debounce from 'lodash.debounce';
export interface FinishFailedInfo {
  values: Record<string, unknown>;
  errorFields: {
    name: (string | number)[];
    errors: string[];
  }[];
  outOfDate: boolean;
}

const SignUpPage: React.FC = () => {
  const [form] = Form.useForm();
  const [invite, setInvite] = useState(
    new URLSearchParams(
      typeof window == 'undefined' ? '' : window?.location?.search
    )?.get('invite')
  );
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error('Failed to fetch user info');
      }

      const userDetails = await response.json();
      const phone =
        userDetails?.phone ||
        userDetails?.phoneNumber ||
        userDetails?.phone_number ||
        '';
      const data = {
        name: userDetails.name || '',
        picture: userDetails.picture || '',
        email: userDetails.email || '',
        username: userDetails.name || '',
        address: userDetails?.address || '',
        phone,
      };
      const res = await post('/auth/google-login', data);
      if (res?.success) {
        Cookies.remove('token');
        localStorage.setItem('token', res?.data?.accessToken);
        Cookies.set('token', res?.data?.accessToken);
        if (Cookies.get('token')) {
          toast.success(res?.message || 'logged in successfully');
          window.location.href = '/';
        } else {
          toast.custom(
            (t: any) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fff',
                  color: '#000',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  width: '350px',
                }}
              >
                <span style={{ flex: 1, marginRight: '8px' }}>
                  ⚠️ Logged in successfully, but cookies are disabled in your
                  browser. Some features may not work as expected.
                </span>
                <button
                  style={{
                    background: '#f27405',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => toast.dismiss(t.id)}
                >
                  Close
                </button>
              </div>
            ),
            {
              duration: 5000,
              position: 'top-center',
            }
          );
          window.location.href = '/';
        }
      } else {
        toast.error(res?.message || 'something went wrong');
      }
    },
    onError: (err) => { },
  });

  const onFinish = async (values: any) => {
    setFormLoading(true);
    const data = {
      password: values?.password,
      confirmPassword: values?.confirmPassword,
      userData: {
        name: values?.fullName,
        username: values?.username,
        phone: values?.phoneNumber,
        email: values?.email,
        address: values?.address,
        inviteToken: invite || '',
      },
    };

    const res = await signUpHandler(data);
    setFormLoading(false);

    if (res?.success) {
      localStorage.setItem('email', values?.email);
      toast.success(res?.message || 'Please check your email');
      router.push('/otp');
    } else {
      if (res?.message?.includes('Email already exists')) {
        toast.error('This email is already registered. Please use a different one.');
      } else {
        toast.error(res?.message || 'Something went wrong. Please try again.');
      }
    }
  };

  const onFinishFailed = ({ errorFields }: FinishFailedInfo) => {
    if (errorFields.length) {
      toast.error(errorFields[0].errors[0]);
    }
  };

  //
  const [addressOptions, setAddressOptions] = useState<Array<{ value: string; label: string; disabled?: boolean }>>([]);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchLocations = async (query: string) => {
    if (!query.trim()) {
      setAddressOptions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.predictions?.length) {
        setAddressOptions(
          data.predictions.map((item: { description: string }) => ({
            value: item.description,
            label: item.description,
          }))
        );
      } else {
        setAddressOptions([{ value: 'no-results', label: 'No results found', disabled: true }]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setAddressOptions([{ value: 'error', label: 'Error loading addresses', disabled: true }]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce the search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchLocations(query);
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value) {
      debouncedSearch(value);
    } else {
      setAddressOptions([]);
    }
  };


  return (
    <>
      <div className="flex flex-col items-center bg-[#2FC191] p-8 rounded-lg max-w-2xl mt-10 w-full">
        <Image src={logo_green} alt="logo" height={100} width={200} />
        <Title level={3} className="text-center text-[#053697] text-3xl">
          Sign Up
        </Title>
        <Button
          className="w-full bg-[#053697] text-white h-[42px]"
          onMouseEnter={(event: any) => (
            (event.target.style.backgroundColor = '#053697c9'),
            (event.target.style.color = '#fff')
          )}
          onMouseLeave={(event: any) => (
            (event.target.style.backgroundColor = '#053697'),
            (event.target.style.color = '#fff')
          )}
          onClick={() => login()}
          icon={<FaGoogle />}
        >
          Sign up with Google
        </Button>

        <hr className="h-[2px] mb-4 w-full bg-white" />

        <Form
          requiredMark={false}
          name="signup"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="w-full"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Full Name" className="h-[42px]" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email" className="h-[42px]" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please enter your phone number' },
            ]}
          >
            <PhoneInput
              country={'us'}
              inputClass="!h-[42px] !w-full !border !border-gray-300 !rounded-md"
              dropdownClass="custom-dropdown"
              containerClass="!w-full"
              enableSearch={true}
              inputProps={{
                name: 'phone',
                required: true,
              }}
            />
          </Form.Item>
          <Form.Item
            label="User Name"
            name="username"
            rules={[{ required: true, message: 'Please enter a username' }]}
          >
            <Input placeholder="User Name" className="h-[42px]" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: 'Please select your address from the dropdown',
              },
            ]}
            className="relative"
          >
            <Select
              showSearch
              placeholder="Search and select your address"
              optionFilterProp="children"
              filterOption={false}
              onSearch={handleSearch}
              onChange={(value) => form.setFieldsValue({ address: value })}
              notFoundContent={isSearching ? 'Searching...' : searchText ? 'No results found' : 'Type to search for your address'}
              style={{ width: '100%' }}
              loading={isSearching}
              allowClear
              className="h-[42px]"
              options={addressOptions}
              dropdownStyle={{ minWidth: '300px' }}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}

            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              placeholder="Password"
              className="h-[42px]"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords do not match')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              className="h-[42px]"
              iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
            />
          </Form.Item>

          <Form.Item
            name="termsAccepted"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                      new Error(
                        'You must accept the terms and privacy policy'
                      )
                    ),
              },
            ]}
          >
            <div>
              <Checkbox className="text-white">I agree to the</Checkbox>
              <Link href={'/terms'}>
                <Text className="cursor-pointer" underline>
                  Terms of Service
                </Text>
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-[#053697] text-white h-[42px]"
              onMouseEnter={(event: any) => (
                (event.target.style.backgroundColor = '#053697c9'),
                (event.target.style.color = '#fff')
              )}
              onMouseLeave={(event: any) => (
                (event.target.style.backgroundColor = '#053697'),
                (event.target.style.color = '#fff')
              )}
            >
              {formLoading ? <Spin size="small" /> : ' Sign up'}
            </Button>
          </Form.Item>
        </Form>

        <Link href="/sign-in" className="text-white cursor-pointer mt-2">
          Sign In
        </Link>
      </div>
      <hr className="h-[4px] w-full mt-6 bg-[#2FC191]" />
      <hr className="h-[4px] w-full mb-6 -mt-[1px] bg-[#053697]" />
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#053697] mb-2">
          How TIPPZ works
        </h2>
        <p className="text-[#2FC191] mb-8">
          Instructions for signing up, verifying your identity, funding your
          account, and sending Tippz.
        </p>

        <div className="flex flex-col-reverse md:flex-row items-start md:space-x-10">
          {/* Left side steps */}
          <div className="flex-1 space-y-8">
            <div className="flex space-x-4">
              <h3 className="text-4xl font-bold text-[#053697]">01</h3>
              <div>
                <h4 className="text-xl font-semibold text-[#053697]">
                  Register your account
                </h4>
                <p className="text-gray-600">
                  When you first register for an account, you’ll be asked to
                  provide your name, email address, date of birth, address,
                  username, password, etc.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <h3 className="text-4xl font-bold text-[#053697]">02</h3>
              <div>
                <h4 className="text-xl font-semibold text-[#053697]">
                  Verify your identity
                </h4>
                <p className="text-gray-600">
                  Privacy and user data protection is very important to us. Our
                  verification process allows us to confirm and authenticate
                  your identity, comply with applicable laws, and prevent fraud.
                  Once verified you are able to start using PROTIPPZ.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <h3 className="text-4xl font-bold text-[#053697]">03</h3>
              <div>
                <h4 className="text-xl font-semibold text-[#053697]">
                  Fund your account
                </h4>
                <p className="text-gray-600">
                  Once you pass through the verification process, you’ll be able
                  to deposit funds and start sending Tippz to your favorite
                  players and teams.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <h3 className="text-4xl font-bold text-[#053697]">04</h3>
              <div>
                <h4 className="text-xl font-semibold text-[#053697]">
                  Sending Tippz
                </h4>
                <p className="text-gray-600">
                  After your account is funded, you’re now able to select a
                  player or team and start sending them Tippz. In exchange for
                  sending Tippz you will earn rewards and potentially win
                  prizes.
                </p>
              </div>
            </div>
          </div>

          {/* Right side image */}
          <div className="mt-8 md:mt-0 flex-1 flex justify-center md:justify-end w-full">
            <Image
              src={phoneImage}
              alt="Phone displaying PROTIPPZ"
              width={600}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUpPage;
