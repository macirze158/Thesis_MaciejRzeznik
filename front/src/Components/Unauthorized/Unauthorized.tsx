import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Unauthorized = () => {
  const navigate = useNavigate()

  const goBack = () => navigate(-1)
  return (
    <div>
      <div>401 Unauthorized</div>
      <button onClick={goBack}>Go Back</button>
    </div>
  )
}

export default Unauthorized
