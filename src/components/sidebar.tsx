"use client"
import React from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Heart, Home, Droplet, Syringe, Package, Calendar, LogOut, History, Users, BarChart2, Building , ShieldCheck} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const Sidebar = () => {
  // const [selectedSidebarOption, setSelectedSidebarOption] = useState<string>();
  const { data: session } = useSession();
  const router = useRouter();

const pathname = usePathname();

const getSidebarOptionFromPath = (path: string): string | undefined => {
  if (path.startsWith('/dashboard/find-donors')) return 'find-donors';
  if (path.startsWith('/dashboard/blood-request')) return 'blood-request';
  if (path.startsWith('/dashboard/donation-schedule')) return 'donation-schedule';
  if (path.startsWith('/dashboard/donation-history')) return 'donation-history';
  if (path.startsWith('/dashboard/leaderboard')) return 'leaderboard';
  if (path.startsWith('/dashboard/event')) return 'event';
  if (path === '/dashboard') return 'overview';

  if (path.startsWith('/admin/dashboard/list-blood_banks')) return 'list-blood_banks';
  if (path.startsWith('/admin/dashboard/list-donors')) return 'list-donors';
  if (path.startsWith('/admin/dashboard/verify-blood_banks')) return 'verify-blood_banks';
  if (path === '/admin/dashboard') return 'admin-overview';

  if (path.startsWith('/dashboard/blood_bank-overview')) return 'blood_bank-overview';
  if (path.startsWith('/dashboard/blood-stock')) return 'blood-stock';
  if (path.startsWith('/dashboard/blood-donation')) return 'blood-donation';
  if (path.startsWith('/dashboard/blood_bank-request')) return 'blood_bank-request';
  if (path.startsWith('/dashboard/blood_bank-donation_schedule')) return 'blood_bank-donation_schedule';
  if (path.startsWith('/dashboard/blood_bank-event')) return 'blood_bank-event';

  return undefined;
};

const selectedSidebarOption = getSidebarOptionFromPath(pathname);
  const handleSidebarSelect = (option: string, role: string) => {
    if (!option && !role) return console.log("error no option and role passed for handle side bar")
    if (role === "blood_bank") {
      if (option === "overview") {
        // setSelectedSidebarOption(option)
        router.push(`/dashboard/blood_bank-overview`)
      } else {
        // setSelectedSidebarOption(option)
        router.push(`/dashboard/${option}`)
      }
    } else if (role === "donor") {
      if (option === "overview") {
        // setSelectedSidebarOption(option)
        router.push(`/dashboard/find-donors`)
      } else {
        // setSelectedSidebarOption(option)
        router.push(`/dashboard/${option}`)
      }
    } else if (role === "admin") {
      if (option === "admin-overview") {
        // setSelectedSidebarOption(option)
        router.push(`/admin/dashboard`)
      } else {
        // setSelectedSidebarOption(option)
        router.push(`/admin/dashboard/${option}`)
      }
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  // useEffect(() => {
  //   if (!session?.user?.role) return
  //   if (session?.user.role === "blood_bank") {
  //     // if (session?.user.role === "blood_bank" && !selectedSidebarOption) {
  //     // setSelectedSidebarOption("overview")
  //     router.push("/dashboard")
  //   } else if (session?.user.role === "donor") {
  //     // setSelectedSidebarOption("find-donors")
  //     router.push("/dashboard/find-donors")
  //   } else if (session?.user.role === "admin") {
  //     // setSelectedSidebarOption("admin-overview")
  //     router.push("/admin/dashboard")
  //   }

  // // }, [session, selectedSidebarOption, router])
  // }, [session, router])


  return (
    <div className="fixed z-10 flex h-screen w-64 flex-col border-r border-gray-200 bg-white pt-20 shadow-sm transition-all">
      <div className="mb-6 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Droplet className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">
              {session?.user.role === "blood_bank" ? "Blood Bank" :session?.user.role === "donor"? "Donor Portal":"Admin Dashboard"}
            </h2>
            <p className="text-xs text-gray-500">{session?.user.name}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {/* Blood Bank Navigation */}
        {session?.user.role === "blood_bank" && (
          <>
            <SidebarItem
              icon={<Home size={20} />}
              label="Blood Overview"
              isSelected={selectedSidebarOption === "blood_bank-overview"}
              onClick={() => handleSidebarSelect("blood_bank-overview", "blood_bank")}
            />
            <SidebarItem
              icon={<Heart size={20} />}
              label="Blood Stock"
              isSelected={selectedSidebarOption === "blood-stock"}
              onClick={() => handleSidebarSelect("blood-stock", "blood_bank")}
            />
            <SidebarItem
              icon={<Syringe size={20} />}
              label="Blood Donation"
              isSelected={selectedSidebarOption === "blood-donation"}
              onClick={() => handleSidebarSelect("blood-donation", "blood_bank")}
            />
            <SidebarItem
              icon={<Droplet size={20} />}
              label="Blood Requests"
              isSelected={selectedSidebarOption === "blood_bank-request"}
              onClick={() => handleSidebarSelect("blood_bank-request", "blood_bank")}
            />
            <SidebarItem
              icon={<Package size={20} />}
              label="Donation Schedule"
              isSelected={selectedSidebarOption === "blood_bank-donation_schedule"}
              onClick={() => handleSidebarSelect("blood_bank-donation_schedule", "blood_bank")}
            />
             <SidebarItem
              icon={<Calendar size={20} />}
              label="Event"
              isSelected={selectedSidebarOption === "blood_bank-event"}
              onClick={() => handleSidebarSelect("blood_bank-event", "blood_bank")}
            />
          </>
        )}

        {/* Donor Navigation */}
        {session?.user.role === "donor" && (
          <>
            <SidebarItem
              icon={<Users size={20} />}
              label="Find Donors"
              isSelected={selectedSidebarOption === "find-donors"}
              onClick={() => handleSidebarSelect("find-donors", "donor")}
            />
            <SidebarItem
              icon={<Droplet size={20} />}
              label="Blood Request"
              isSelected={selectedSidebarOption === "blood-request"}
              onClick={() => handleSidebarSelect("blood-request", "donor")}
            />
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Donation Schedule"
              isSelected={selectedSidebarOption === "donation-schedule"}
              onClick={() => handleSidebarSelect("donation-schedule", "donor")}
            />
            <SidebarItem
              icon={<History size={20} />}
              label="Donation History"
              isSelected={selectedSidebarOption === "donation-history"}
              onClick={() => handleSidebarSelect("donation-history", "donor")}
            />
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Event"
              isSelected={selectedSidebarOption === "event"}
              onClick={() => handleSidebarSelect("event", "donor")}
            />
            <SidebarItem
              icon={<BarChart2 size={20} />}
              label="Leaderboard"
              isSelected={selectedSidebarOption === "leaderboard"}
              onClick={() => handleSidebarSelect("leaderboard", "donor")}
            />
          </>
        )}

        {session?.user.role === "admin" && (
          <>
            <SidebarItem
              icon={<Home size={20} />}
              label="Overview"
              isSelected={selectedSidebarOption === "admin-overview"}
              onClick={() => handleSidebarSelect("admin-overview", "admin")}
            />
            <SidebarItem
              icon={<Building size={20} />}
              label="Blood Banks"
              isSelected={selectedSidebarOption === "list-blood_banks"}
              onClick={() => handleSidebarSelect("list-blood_banks", "admin")}
            />
            <SidebarItem
              icon={<Users size={20} />}
              label="Donors"
              isSelected={selectedSidebarOption === "list-donors"}
              onClick={() => handleSidebarSelect("list-donors", "admin")}
            />
            <SidebarItem
              icon={<ShieldCheck  size={20} />}
              label="Verify Blood Banks"
              isSelected={selectedSidebarOption === "verify-blood_banks"}
              onClick={() => handleSidebarSelect("verify-blood_banks", "admin")}
            />
          </>
        )}
      </div>

      {/* Bottom section with stats and sign out */}
      <div className="mt-auto border-t border-gray-200 p-3">
        <SidebarItem
          icon={<LogOut size={20} />}
          label="Sign Out"
          onClick={handleSignOut}
          className="text-gray-700 hover:bg-red-50 hover:text-red-600"
        />
      </div>
    </div>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isSelected?: boolean
  onClick: () => void
  className?: string
}

const SidebarItem = ({ icon, label, isSelected, onClick, className }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isSelected
        ? "bg-red-50 text-red-600"
        : className || "text-gray-700 hover:bg-gray-100"
        } ${className || ""}`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center ${isSelected ? "text-red-600" : "text-gray-500 group-hover:text-gray-700"
          }`}
      >
        {icon}
      </div>
      <span>{label}</span>
      {isSelected && (
        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-red-600"></div>
      )}
    </button>
  )
}

export default Sidebar
