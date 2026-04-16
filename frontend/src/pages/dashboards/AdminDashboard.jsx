import { useState } from 'react';
import { LayoutDashboard, Users, UserCheck, CreditCard, Shield, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-gray-100 min-h-screen flex">
      <aside className="w-64 bg-maroon-700 text-white hidden md:block flex-shrink-0">
         <div className="p-6 border-b border-maroon-600 flex items-center justify-center gap-2">
            <Shield className="w-8 h-8 text-gold-500" />
            <h2 className="font-bold text-xl">Admin Panel</h2>
         </div>
         <nav className="p-4 space-y-2">
            {[
               { id: 'overview', icon: LayoutDashboard, label: 'Analytics Overview' },
               { id: 'verifications', icon: UserCheck, label: 'Pandit Verification' },
               { id: 'users', icon: Users, label: 'Manage All Users' },
               { id: 'payments', icon: CreditCard, label: 'Transactions' },
               { id: 'system', icon: Activity, label: 'System Logs' }
            ].map(tab => (
               <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === tab.id ? 'bg-maroon-600 shadow-inner' : 'text-maroon-100 hover:bg-maroon-600/50'}`}>
                  <tab.icon className="w-5 h-5 text-gold-500" /> {tab.label}
               </button>
            ))}
         </nav>
      </aside>

      <main className="flex-1 p-8">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 capitalize">Platform {activeTab}</h1>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-bold text-maroon-600 border-l-4 border-l-gold-500">
               Live Platform Status: Operational
            </div>
         </div>

         {activeTab === 'overview' && (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                     { label: 'Total Revenue', value: '₹4,52,000', change: '+12%', color: 'text-green-500' },
                     { label: 'Active Pandits', value: '1,240', change: '+8%', color: 'text-blue-500' },
                     { label: 'Total Bookings', value: '8,920', change: '+24%', color: 'text-saffron-500' },
                     { label: 'Pending Approvals', value: '18', change: '-2%', color: 'text-red-500' }
                  ].map(stat => (
                     <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                        <span className="text-gray-500 font-medium pb-2 text-sm uppercase tracking-wider">{stat.label}</span>
                        <div className="flex items-end justify-between mt-2">
                           <span className="text-3xl font-black text-gray-800">{stat.value}</span>
                           <span className={`text-sm font-bold ${stat.color} bg-gray-50 px-2 py-1 rounded`}>{stat.change}</span>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                     <h3 className="font-bold text-gray-800 text-lg mb-4">Pending Pandit Applications</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-100">
                                 <th className="p-3">Name</th>
                                 <th className="p-3">Location</th>
                                 <th className="p-3">Experience</th>
                                 <th className="p-3">Action</th>
                              </tr>
                           </thead>
                           <tbody className="text-sm">
                              {[1,2,3].map(i => (
                                 <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="p-3 font-semibold text-gray-800">Pt. Rajesh Tripathi</td>
                                    <td className="p-3 text-gray-600">Lucknow</td>
                                    <td className="p-3 text-gray-600">8 Years</td>
                                    <td className="p-3 flex gap-2">
                                       <button className="bg-maroon-50 text-maroon-700 px-3 py-1 rounded text-xs font-bold hover:bg-maroon-100">Review</button>
                                       <button className="bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-bold hover:bg-green-100">Approve</button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     <button className="w-full mt-4 bg-gray-50 text-gray-600 py-3 rounded-lg text-sm font-bold hover:bg-gray-100 border border-gray-200 transition-colors">View All Applications</button>
                  </div>
                  
                  <div className="bg-gradient-to-br from-maroon-600 to-maroon-800 rounded-2xl shadow-sm p-6 text-white text-center flex flex-col justify-center items-center">
                     <Activity className="w-16 h-16 text-gold-500 mb-4 opacity-80" />
                     <h3 className="text-xl font-bold mb-2">System Health</h3>
                     <p className="text-saffron-100 text-sm mb-6">Database, API, and Payment gateways are fully operational.</p>
                     <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2 rounded-lg transition-colors">View Detailed Logs</button>
                  </div>
               </div>
            </>
         )}

         {activeTab !== 'overview' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center min-h-[40vh] text-center">
               <div className="text-6xl mb-4 opacity-50">🚧</div>
               <h3 className="text-xl font-bold text-gray-700 mb-2">Under Construction</h3>
               <p className="text-gray-500 max-w-sm">This admin module is currently being built.</p>
            </div>
         )}
      </main>
    </div>
  );
}
