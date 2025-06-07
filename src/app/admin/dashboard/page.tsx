import React from 'react'

const page = () => {
   const metrics = [
    {
      title: "Total Blood Banks",
      value: "24",
      description: "Registered blood banks",
      icon: "🏥",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Donors",
      value: "120",
      description: "Active blood donors",
      icon: "🩸",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      title: "Pending Verifications",
      value: "3",
      description: "Blood banks awaiting approval",
      icon: "⏳",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-200"
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Overview
          </h1>
          <p className="text-gray-600">
            Monitor and manage your blood donation system
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`${metric.bgColor} ${metric.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{metric.icon}</div>
                <div className={`${metric.textColor} text-sm font-medium px-2 py-1 rounded-full bg-white/50`}>
                  Active
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {metric.title}
                </h3>
                <div className={`text-3xl font-bold ${metric.textColor}`}>
                  {metric.value}
                </div>
                <p className="text-sm text-gray-600">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-left">
              <div className="text-2xl mr-3">👥</div>
              <div>
                <div className="font-medium text-gray-900">Manage Donors</div>
                <div className="text-sm text-gray-600">View and edit donor profiles</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors duration-200 text-left">
              <div className="text-2xl mr-3">✅</div>
              <div>
                <div className="font-medium text-gray-900">Verify Blood Banks</div>
                <div className="text-sm text-gray-600">Review pending applications</div>
              </div>
            </button>
            
            <button className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200 text-left">
              <div className="text-2xl mr-3">📊</div>
              <div>
                <div className="font-medium text-gray-900">View Reports</div>
                <div className="text-sm text-gray-600">Generate system reports</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-gray-50">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  New blood bank registered
                </div>
                <div className="text-xs text-gray-600">City General Hospital - 2 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-gray-50">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  5 new donors registered
                </div>
                <div className="text-xs text-gray-600">Various locations - 4 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-gray-50">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  Blood bank verification pending
                </div>
                <div className="text-xs text-gray-600">Metro Health Center - 6 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page