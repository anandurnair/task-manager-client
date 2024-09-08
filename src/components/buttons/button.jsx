import React from 'react'

const Button = ({value,handler}) => {
  return (
    <button className='px-6 h-10 bg-white text-blue-500 font-semibold rounded' onClick={handler}>{value}</button>
  )
}

export default Button
