import React from 'react'
import Appbar from '../components/Appbar'
import Balance from '../components/Balance'
import Users from '../components/Users'

const Dashboard = () => {
  return (
    <div>
      <Appbar />
      <div className='m-8'>
        <Balance value={"1000,000,000"} />
        <Users />
      </div>
    </div>
  )
}

export default Dashboard
