import Tabs from '../Tabs'
import { FaUsers } from 'react-icons/fa'
import AllUsers from './users_table/AllUsers'
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from '@/lib/permissions';
import { Unauthorized } from '../Unauthorzed';



const Users = () => {
   const {permissions, businessProfile} = useAuth();
   
  const isAllowed = businessProfile?.appRole === "owner" ||  hasPermission(permissions, "operations.view.staff");
 
   if(!isAllowed) return <Unauthorized />
  return (
     <Tabs
      defaultTab="users"
      onChange={() =>  window.scroll({top:0, behavior: "smooth"})}
      tabs={[
        {
          key: "users",
          label: "All Staff",
          icon: <FaUsers className='text-[#8a76f9]' />,
          panel: <AllUsers />,
          code: "operations.view.staff"
        },
        // {
        //   key: "add_user",
        //   label: "Add User",
        //   icon: <FaPlus />,
        //   panel: <AddRoleForm />,
        // },
      ]}
    />
  )
}

export default Users