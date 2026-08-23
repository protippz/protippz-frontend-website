function page() {
  return (
    <div className="max-w-355 mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Delete Your PROTIPPZ Account
        </h1>

        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How to request account deletion:
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Open the PROTIPPZ app on your device</li>
              <li>
                Go to <strong>Settings</strong> &rarr; <strong>Account</strong>{" "}
                &rarr; <strong>Delete Account</strong>
              </li>
              <li>Confirm your request</li>
            </ol>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-gray-700 mb-2">OR Email us at:</p>
              <div className="bg-white p-3 rounded border border-blue-300">
                <p className="font-mono text-blue-600">cory@protippz.com</p>
                <p className="text-sm text-gray-600 mt-1">
                  Subject line: "ACCOUNT DELETION REQUEST"
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-3">Please include your:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 ml-4">
                <li>Registered email address</li>
                <li>Username</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What happens when you delete your account:
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">&times;</span>
                Your profile information is permanently removed
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">&times;</span>
                Your transaction history is anonymized
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">&times;</span>
                Your rewards and points are forfeited
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">&times;</span>
                This action cannot be undone
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Data retention:
            </h2>
            <p className="text-gray-700 mb-3">Some data may be retained for:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">&bull;</span>
                Legal compliance (tax records, KYC)
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">&bull;</span>
                Fraud prevention
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">&bull;</span>
                Up to 90 days for backup restoration
              </li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Processing time:
            </h2>
            <p className="text-gray-700">
              Requests are typically processed within 7-10 business days.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            If you have any questions about the deletion process, please contact
            our support team.
          </p>
        </div>
      </div>
    </div>
  );
}

export default page;
